<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Invitation;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class RegisteredUserController extends Controller
{
    public function create(): InertiaResponse
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'token' => 'nullable|string', // Add this to handle the optional token
        ]);

        $user_id = null; // Initialize to null

        // Check if a token is present in the request
        if ($request->filled('token')) {
            $token = $request->input('token');
            $invitation = Invitation::where('token', $token)->first();
            
            
            if (!$invitation) {
                return redirect('/register')->withErrors(['token' => 'Invalid token']);
            }

            $user_id = $invitation->user_id; // Set user_id if the token is valid
            /* dd($user_id); */
            // Delete the invitation so the token can't be used again
            $invitation->delete();
        }

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_id' => $user_id, // Will be null if no valid token is found
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }

}
