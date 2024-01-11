<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invitation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;  // Add this line
use Illuminate\Support\Facades\Mail;  // Add this line
use App\Mail\InviteMail;  // Make sure the path is correct
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;


class InviteController extends Controller
{
    /* public function invite()
    {
        return view('invite');  // We will use Blade for now
    } */

    // App\Http\Controllers\InviteController




    public function invite(Request $request)
    {
        $user = auth()->user();

        // Check if the user is a child user
        if ($user->user_id) {
            // Redirect or return an error response
            return redirect('dashboard')->with('error', 'Access denied');
        }

        // Retrieve user-related data
        $parentUserId = $user->id;
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->get();

        // Return an Inertia response
        return Inertia::render('Invite', [
            'auth' => [
                'allUserIdsUnderSameParent' => $allUserIdsUnderSameParent,
            ],
        ]);
    }


    public function processInvite(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $token = Str::random(32);

        Invitation::create([
            'user_id' => Auth::id(),
            'email' => $request->email,
            'token' => $token,
        ]);

        // Send the email (this is simplified; you should queue this)
        Mail::to($request->email)->send(new InviteMail($token));

        return redirect()->back()->with('message', 'Invitation sent successfully.');
    }
}
