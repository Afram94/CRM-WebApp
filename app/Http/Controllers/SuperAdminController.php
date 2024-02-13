<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    public function index()
    {
        return inertia('SuperAdminDashboard', [
            /* 'auth' => [ */
                "hej"
            /* ] */
        ]);
    }
}
