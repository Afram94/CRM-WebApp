<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $parentUserId = $user->user_id ? $user->user_id : $user->id;
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                            ->orWhere('id', $parentUserId)
                                            /* ->pluck('name')->toArray(); */
                                            ->get();

        /* dd($allUserIdsUnderSameParent); */

        return inertia('Users/Show', [
            'auth' => [
                'allUserIdsUnderSameParent' => $allUserIdsUnderSameParent,
                /* 'customers' => $customers */
            ],
        ]);
    }
}
