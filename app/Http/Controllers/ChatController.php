<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = Message::create([
            'from_user_id' => auth()->id(),
            'to_user_id' => $request->to_user_id,
            'message' => $request->message,
        ]);

        // Broadcast the message using Laravel events
        broadcast(new \App\Events\NewChatMessage($message));
    
        return response()->json(['message' => 'Message sent successfully', 'data' => $message]);
    }
    
    public function fetchMessages(Request $request, $userId)
    {
        $messages = Message::where(function($query) use ($userId) {
            $query->where('from_user_id', auth()->id())->where('to_user_id', $userId);
        })->orWhere(function($query) use ($userId) {
            $query->where('from_user_id', $userId)->where('to_user_id', auth()->id());
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

    // The rest of your methods...
}