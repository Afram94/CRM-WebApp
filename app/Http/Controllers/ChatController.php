<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

use App\Events\NewChatMessage;

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

        broadcast(new NewChatMessage($message));

        return response()->json(['message' => 'Message sent successfully', 'data' => $message]);
    }

    public function fetchMessages($userId)
    {
        $user = auth()->user()->id;
        $messages = Message::where(function($query) use ($user, $userId) {
            $query->where('from_user_id', $user)->where('to_user_id', $userId);
        })->orWhere(function($query) use ($user, $userId) {
            $query->where('from_user_id', $userId)->where('to_user_id', $user);
        })->orderBy('created_at', 'asc')
        ->get(['id', 'from_user_id', 'to_user_id', 'message', 'created_at']); // Selecting the 'created_at' field



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

    $usersWithLastMessage = User::where(function ($query) use ($currentUser) {
        $query->where('id', '!=', $currentUser->id); // Exclude the current user
    })
    ->with(['sentMessages' => function ($query) {
        $query->latest()->first();
    }, 'receivedMessages' => function ($query) {
        $query->latest()->first();
    }])
    ->get(['id', 'name', 'email'])
    ->map(function ($user) {
        // Select the most recent message either sent or received
        $lastMessage = $user->sentMessages->merge($user->receivedMessages)->sortDesc()->first();
        $user->last_message = $lastMessage ? $lastMessage->message : null;
        $user->last_message_date = $lastMessage ? $lastMessage->created_at : null;
        unset($user->sentMessages, $user->receivedMessages); // Clean up
        return $user;
    });

    return response()->json($usersWithLastMessage);
}


    // The rest of your methods...
}