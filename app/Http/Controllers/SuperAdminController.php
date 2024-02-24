<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Initialize the query with a base query builder instance
        $query = User::withCount(['customers', 'products']);

        // Apply search conditions if $search is not empty
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
                // Add more fields as necessary
            });
        }

        // Execute the query
        $users = $query->get();

        if ($request->wantsJson()) {
            return response()->json([
                'auth' => [
                    'superadminusers' => $users,
                ]
            ]);
        }

        // Return the Inertia view with the enriched users data
        return Inertia::render('SuperAdminDashboard', [
            'auth' => [
                'superadminusers' => $users,
            ]
        ]);
    }
}
