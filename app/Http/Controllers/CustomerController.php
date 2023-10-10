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



    public function store(Request $request) {
    $customer = new Customer($request->all());
    $customer->user_id = auth()->id();
    $customer->save();
    
    return Inertia::render('Dashboard', ['message' => 'Customer created!']);
    }

    /* public function index()
    {
    $customers = auth()->user()->customers;

    return Inertia::render('Customers/CreateCustomer', ['customers' => $customers]);
    } */

    public function index()
{
    $user = auth()->user();

    // Fetch customers that belong to the authenticated user
    $customers = Customer::where('user_id', $user->id)->get();

    return inertia('Customers/CustomersList', [
        'auth' => [
            'user' => $user,
            'customers' => $customers
        ]
    ]);
}

}
