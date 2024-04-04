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
        $search = $request->input('search', '');

        // Determine the parent user ID based on the admin-child relationship
        $parentUserId = $currentUser->user_id ? $currentUser->user_id : $currentUser->id;

        $query = User::query()->where('user_id', $parentUserId)
            ->orWhere(function($query) use ($parentUserId, $currentUser) {
                $query->where('id', $parentUserId)
                    ->where('id', '!=', $currentUser->id); // Exclude the current user
            });

        // Apply search criteria if present
        if (!empty($search)) {
            $query->where(function($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $users = $query->with(['sentMessages' => function ($query) {
                    $query->latest()->first();
                }, 'receivedMessages' => function ($query) {
                    $query->latest()->first();
                }])
                ->get(['id', 'name', 'email'])
                ->map(function ($user) {
                    // Processing to merge messages and select the most recent
                    $lastMessage = $user->sentMessages->merge($user->receivedMessages)->sortDesc()->first();
                    $user->last_message = $lastMessage ? $lastMessage->message : null;
                    $user->last_message_date = $lastMessage ? $lastMessage->created_at : null;
                    unset($user->sentMessages, $user->receivedMessages); // Clean up
                    return $user;
                });

        return response()->json($users);
    }

    /* public function listUsers(Request $request)
    {
        $currentUser = auth()->user();
        $search = $request->input('search', '');

        $query = User::query()->where(function($q) use ($currentUser) {
            // Check for parent-child relationship
            $q->where('user_id', $currentUser->user_id ?: $currentUser->id)
            ->orWhere('id', $currentUser->user_id ?: $currentUser->id);
        });

        // Apply search criteria if present
        if (!empty($search)) {
            $query->where(function($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $users = $query->with(['sentMessages' => function ($query) {
                    $query->latest()->first();
                }, 'receivedMessages' => function ($query) {
                    $query->latest()->first();
                }])
                ->get(['id', 'name', 'email'])
                ->map(function ($user) {
                    // Process to merge messages and select the most recent
                    $lastMessage = $user->sentMessages->merge($user->receivedMessages)->sortDesc()->first();
                    $user->last_message = $lastMessage ? $lastMessage->message : null;
                    $user->last_message_date = $lastMessage ? $lastMessage->created_at : null;
                    unset($user->sentMessages, $user->receivedMessages); // Clean up
                    return $user;
                });

        if ($request->wantsJson()) {
            return response()->json([
                'auth' => [
                    'user' => $currentUser,
                    'users' => $users,
                ]
            ]);
        }

        // Assuming you might want to return a view if it's not a JSON request
        // Adjust this part as needed for your application's flow
        return inertia('UsersChat/UserList', [
            'auth' => [
                'user' => $currentUser,
                'users' => $users,
            ]
        ]);
    } */


    public function deleteMessage($messageId)
    {
        $user = auth()->user();

        $message = Message::where('id', $messageId)
            ->where(function($query) use ($user) {
                $query->where('from_user_id', $user->id)
                    ->orWhere('to_user_id', $user->id);
            })->firstOrFail();

        $message->delete();

        return response()->json(['message' => 'Message deleted successfully']);
    }

    public function updateMessage(Request $request, $messageId)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $user = auth()->user();

        $message = Message::where('id', $messageId)
                        ->where('from_user_id', $user->id)
                        ->firstOrFail();

        $message->update([
            'message' => $request->message,
        ]);

        broadcast(new NewChatMessage($message)); // Optionally broadcast this change

        return response()->json(['message' => 'Message updated successfully', 'data' => $message]);
    }




    // The rest of your methods...
}