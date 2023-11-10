<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\User;
use App\Models\CustomerCustomField;
use Inertia\Inertia;
use App\Events\CustomerCreated;
use App\Events\CustomerUpdated;
use App\Events\CustomerDeleted;
use App\Jobs\ProcessNewCustomer;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class CustomerController extends Controller
{

    public function index(Request $request) {

        $user = auth()->user();
        $search = $request->input('search');

        // Determine the parent user ID (it's either the user's own ID or their parent's ID)
        $parentUserId = $user->user_id ? $user->user_id : $user->id;
        /* dd($parentUserId); */

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();

        // Start the query
        $query = Customer::with(['customFieldsValues', 'customFieldsValues.customField'])
            ->whereIn('user_id', $allUserIdsUnderSameParent);

        // If there's a search term, filter the customers by it. 
        if ($search) {
            $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('email', 'LIKE', '%' . $search . '%')
                    ->orWhere('phone_number', 'LIKE', '%' . $search . '%');
        }

        // Fetch customers that belong to the authenticated user
        $customers = $query->latest()->paginate(20);

        /* dd($customers->toArray()['data']); */

        // If the request is an AJAX call, return the customers as JSON.
        if ($request->wantsJson()) {
            return response()->json([
                'auth' => [
                    'user' => $user,
                    'customers' => $customers
                ]
            ]);
        }

        // If it's a regular page request, return the Inertia view.
        return inertia('Customers/Show', [
            'auth' => [
                'user' => $user,
                'customers' => $customers
            ]
        ]);
    }

    public function store(Request $request)
    {
        // Validate fixed fields
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone_number' => 'required|numeric',
            'custom_fields' => 'required|array' // Ensure custom fields are provided
        ]);

        // Start the transaction
        DB::beginTransaction();

        try {
            // Create the customer
            $customer = new Customer([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone_number' => $request->input('phone_number'),
            ]);

            $customer->user_id = auth()->id();
            $customer->save();

            // Process custom fields
            $customFields = $request->input('custom_fields');
            $validationRules = $this->prepareValidationRules($customFields);
            $request->validate($validationRules);

            // Save custom fields
            foreach ($customFields as $fieldId => $value) {
                $fieldDefinition = CustomerCustomField::findOrFail($fieldId);
                $customer->customFieldsValues()->create([
                    'field_id' => $fieldId,
                    'value' => $value,
                ]);
            }

            // Commit the transaction
            DB::commit();

            /* dd($customer->load('customFieldsValues')); */
            // Broadcast the event after the data has been persisted
            broadcast(new CustomerCreated($customer->load('customFieldsValues.customField')));

            return response()->json($customer);

        } catch (\Exception $e) {
            // If there is an exception, rollback the transaction
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    // Update the specified customer in storage
    public function update(Request $request, $id)
    {
        // Validate fixed fields
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:customers,email,' . $id,
            'phone_number' => 'numeric',
            'custom_fields' => 'array' // Custom fields are optional
        ]);

        // Start the transaction
        DB::beginTransaction();

        try {
            // Fetch the customer
            $customer = Customer::findOrFail($id);

            // Update fixed fields
            $customer->update($request->only(['name', 'email', 'phone_number']));

            // Process and update custom fields if provided
            if ($request->has('custom_fields')) {
                $customFields = $request->input('custom_fields');
                $validationRules = $this->prepareValidationRules($customFields);
                $request->validate($validationRules);

                foreach ($customFields as $fieldId => $value) {
                    // Update or create custom field value
                    $customer->customFieldsValues()->updateOrCreate(
                        ['field_id' => $fieldId],
                        ['value' => $value]
                    );
                }
            }

            // Commit the transaction
            DB::commit();

            // Optionally load relations and broadcast the update event
            broadcast(new CustomerUpdated($customer->load('customFieldsValues.customField')));

            return response()->json($customer);

        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


        private function prepareValidationRules(array $customFields)
        {
            $validationRules = [];
            foreach ($customFields as $fieldId => $value) {
                $fieldDefinition = CustomerCustomField::findOrFail($fieldId);

                // Set validation rules based on the field's type
                switch ($fieldDefinition->field_type) {
                    case 'string':
                        $validationRules["custom_fields.$fieldId"] = 'required|string';
                        break;
                    case 'integer':
                        $validationRules["custom_fields.$fieldId"] = 'required|numeric';
                        break;
                    case 'date':
                        $validationRules["custom_fields.$fieldId"] = 'required|date';
                        break;
                    case 'boolean':
                        $validationRules["custom_fields.$fieldId"] = 'required|boolean';
                        break;
                    // ... add other cases as needed
                    default:
                        $validationRules["custom_fields.$fieldId"] = 'required|string';
                }
            }
            return $validationRules;
        }


        // Remove the specified customer from storage
    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
    
        // Ensure the user owns this customer
        /* if ($customer->user_id !== auth()->id()) {
            return response()->json(['error' => 'Not authorized'], 403);
        } */

        $user = auth()->user();
        // Determine the parent user ID (it's either the user's own ID or their parent's ID)
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();


        // Check if customer exists and belongs to the authenticated user and the users that belongs to it
        if (!$customer || !in_array($customer->user_id, $allUserIdsUnderSameParent)) {
            return response()->json(['error' => 'customer not found or not authorized'], 403);
        }

        broadcast(new CustomerDeleted($customer->id, $customer->user_id));
        
        $customer->delete();
        
    
        return response()->json(['message' => 'Customer deleted!'], 200);
    }

    

    
    // Show the form for editing the specified customer
    public function edit($id)
    {
        $customer = Customer::findOrFail($id);
        return Inertia::render('Customers/Edit', ['customer' => $customer]);
    }

    public function create()
    {
        return Inertia::render('Customers/CreateCustomer');
    }

    


    


}
