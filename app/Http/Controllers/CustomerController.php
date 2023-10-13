<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
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

    public function store(Request $request) {
        $customer = new Customer([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
        ]);
        $customer->user_id = auth()->id();
        $customer->save();

        return response()->json($customer);
    }

    public function index() {
    $user = auth()->user();

    // Fetch customers that belong to the authenticated user
    $customers = Customer::where('user_id', $user->id)->latest()->paginate(10);

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
