<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invitation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;  // Add this line
use Illuminate\Support\Facades\Mail;  // Add this line
use App\Mail\InviteMail;  // Make sure the path is correct

class InviteController extends Controller
{
    public function invite()
    {
        return view('invite');  // We will use Blade for now
    }

    public function processInvite(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $token = Str::random(32);

        Invitation::create([
            'inviter_id' => Auth::id(),
            'email' => $request->email,
            'token' => $token,
        ]);

        // Send the email (this is simplified; you should queue this)
        Mail::to($request->email)->send(new InviteMail($token));

        return redirect()->back()->with('message', 'Invitation sent successfully.');
    }
}
