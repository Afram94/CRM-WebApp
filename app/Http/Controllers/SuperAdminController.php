<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class SuperAdminController extends Controller
{
    public function index()
    {

        $users = User::all(); // Use User::all() to get all users
        /* $search = $request->input('search'); */

        /* // Determine the parent user ID (it's either the user's own ID or their parent's ID)
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray(); */

        // Start the query
        /* $query = Customer::with(['customFieldsValues', 'customFieldsValues.customField'])
            ->whereIn('user_id', $allUserIdsUnderSameParent);

        // If there's a search term, filter the customers by it. 
        if ($search) {
            $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('email', 'LIKE', '%' . $search . '%')
                    ->orWhere('phone_number', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('customFieldsValues', function($query) use ($search) {
                        $query->where('value', 'LIKE', '%' . $search . '%'); // Assuming 'value' is the field in the JSON
                    });
        } */

        // Fetch customers that belong to the authenticated user
        /* $customers = $query->latest()->paginate(20); */



        // If it's a regular page request, return the Inertia view.
        return inertia('SuperAdminDashboard', [
            'auth' => [
                'superadminusers' => $users,
                /* 'customers' => $customers */
            ]
        ]);

    }
}
