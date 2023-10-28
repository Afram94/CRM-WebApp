<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\User;
use Inertia\Inertia;

class CustomerController extends Controller
{

    public function create()
{
    return Inertia::render('Customers/CreateCustomer');
}

    /* public function store(Request $request) {
    $customer = new Customer($request->all());
    $customer->user_id = auth()->id();
    $customer->save();
    
    return Inertia::render('Dashboard', ['message' => 'Customer created!']);
    } */

    /* public function store(Request $request) {
        $customer = new Customer([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
        ]);
        $customer->user_id = auth()->id();
        $customer->save();

        return response()->json($customer);
    } */

    public function store(Request $request)
    {
        $customer = new Customer([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
        ]);
        $customer->user_id = auth()->id();
        $customer->save();
        
        // Handle custom field values
        /* $customFieldValues = $request->input('custom_field_values', []);
        foreach ($customFieldValues as $fieldId => $value) {
            $fieldValue = new CustomerCustomFieldValue([
                'customer_id' => $customer->id,
                'field_id' => $fieldId,
                'value' => $value,
            ]);
    
            $fieldValue->save();
        } */
    
        return response()->json($customer);
    }
    

    

        public function index(Request $request) {
            /* $user = auth()->user();
            $search = $request->input('search');

            // Start the query
            $query = Customer::where('user_id', $user->id); */

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
            $customers = $query->latest()->paginate(10);

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


    // Show the form for editing the specified customer
    public function edit($id)
    {
        $customer = Customer::findOrFail($id);
        return Inertia::render('Customers/Edit', ['customer' => $customer]);
    }

    // Update the specified customer in storage
    public function update(Request $request, $id) {
        $customer = Customer::find($id);
    
        // Check if customer exists and belongs to the authenticated user
        if (!$customer || $customer->user_id !== auth()->id()) {
            return response()->json(['error' => 'Customer not found or not authorized'], 403);
        }
    
        // Update the customer
        //$customer->name = $request->input('name');
        //or user update function
        $customer->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
            // ... add other fields as needed
        ]);
        $customer->save();
    
        return response()->json(['message' => 'Customer updated successfully']);
    }

    // Remove the specified customer from storage
    public function destroy($id)
{
    $customer = Customer::findOrFail($id);

    // Ensure the user owns this customer
    if ($customer->user_id !== auth()->id()) {
        return response()->json(['error' => 'Not authorized'], 403);
    }

    $customer->delete();

    return response()->json(['message' => 'Customer deleted!'], 200);
}


}
