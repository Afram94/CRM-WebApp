<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'token' => 'required|exists:invitations,token',  // Validates the invitation token
        ]);

        // Fetch the invitation model that matches the token
        $invitation = Invitation::where('token', $request->token)->firstOrFail();

        // Create the user with the inviter_id
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'inviter_id' => $invitation->inviter_id,  // Link the user to the inviter
        ]);

        // Delete the invitation so the token can't be used again
        $invitation->delete();

        // Fire the Registered event
        event(new Registered($user));

        // Log the user in
        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }

}
