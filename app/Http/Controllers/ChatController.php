<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
{
    $request->validate([
        'to_user_id' => 'required|integer', // Ensure validation for to_user_id
        'message' => 'required|string', // Validate message as well
    ]);

    $message = Message::create([
        'from_user_id' => auth()->id(),
        'to_user_id' => $request->to_user_id, // Extracting to_user_id from the request
        'message' => $request->message,
    ]);

    broadcast(new \App\Events\NewChatMessage($message));

    return response()->json(['message' => 'Message sent successfully', 'data' => $message]);
}

public function fetchMessages($userId)
{
    $user = auth()->user()->id;
    $messages = Message::where(function($query) use ($user, $userId) {
        $query->where('from_user_id', $user)->where('to_user_id', $userId);
    })->orWhere(function($query) use ($user, $userId) {
        $query->where('from_user_id', $userId)->where('to_user_id', $user);
    })->get();

    return response()->json(['messages' => $messages]);
}



    public function index(Request $request)
    {
        $user = auth()->user();
        $search = $request->input('search', '');

        // Fetch all users except the currently authenticated one
        // Apply search criteria if present
        $users = User::where('id', '!=', $user->id)
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('name', 'LIKE', '%' . $search . '%')
                          ->orWhere('email', 'LIKE', '%' . $search . '%');
                });
            })
            ->get();

        // Return the users using Inertia
        return inertia('UsersChat/Chat', [
            'auth' => [
                'users' => $users,
                'search' => $search
            ]
        ]);
    }

    public function listUsers(Request $request)
    {
        $currentUser = auth()->user();

        // Assuming 'user_id' represents the admin ID for non-admin users
        // and 'id' for the admin itself. Adjust the logic if your database schema differs.
        $parentUserId = $currentUser->user_id ? $currentUser->user_id : $currentUser->id;

        $users = User::where('user_id', $parentUserId)
                    ->orWhere('id', $parentUserId)
                    ->where('id', '!=', $currentUser->id) // Exclude the current user
                    ->get(['id', 'name', 'email']); // Fetch only necessary fields

        return response()->json($users);
    }

    // The rest of your methods...
}