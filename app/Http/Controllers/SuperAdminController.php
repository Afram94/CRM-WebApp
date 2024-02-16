<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;

class SuperAdminController extends Controller
{
    public function index()
    {
        // Fetch all users with the counts of their related customers and products
        $users = User::withCount(['customers', 'products'])->get();

        // Return the Inertia view with the enriched users data
        return Inertia::render('SuperAdminDashboard', [
            'auth' => [
                'superadminusers' => $users,
            ]
        ]);
    }
}

