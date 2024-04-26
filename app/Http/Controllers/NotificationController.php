<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;


class NotificationController extends Controller
{
    // Fetch all notifications for the logged-in user
   /*  public function index(Request $request)
    {
        $user = auth()->user();
        $parentUserId = $user->user_id ? $user->user_id : $user->id;
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();

        $notifications = Notification::whereIn('user_id', $allUserIdsUnderSameParent)
                                    ->orderBy('created_at', 'desc')
                                    ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'auth' => [
                    'user' => $user,
                    'notifications' => $notifications,
                ]
            ]);
        }

        return inertia('Notifications/Show', [
            'auth' => [
                'user' => $user,
                'notifications' => $notifications,
            ]
        ]);
    } */

    /* public function index(Request $request)
    {
        $user = Auth::user(); // Using Auth facade for clarity
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $notifications = $user->notifications()->where('seen', false)->get();
    
        Log::info('Notifications: ' . $notifications->toJson()); // This will log the fetched notifications
    
        return response()->json($notifications);
    } */

    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            Log::error('No authenticated user.');
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Determine the parent user ID
        $parentUserId = $user->user_id ? $user->user_id : $user->id;
        Log::info('Parent User ID: ' . $parentUserId);

        // Fetch all user IDs under the same parent
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();
        Log::info('All User IDs under same parent: ' . json_encode($allUserIdsUnderSameParent));

        // Fetch notifications for all users within the same group
        $notifications = Notification::whereIn('user_id', $allUserIdsUnderSameParent)
                                    ->where('seen', false)
                                    ->get();

        if ($notifications->isEmpty()) {
            Log::info('No notifications found for user group.');
        }

        return response()->json($notifications);
    }


    
    

    

    // Mark a specific notification as read
    public function markAsRead($notificationId)
    {
        $userId = Auth::id();
        $notification = Notification::where('id', $notificationId)
                                    ->where('user_id', $userId)
                                    ->first();

        if ($notification) {
            $notification->seen = true;
            $notification->save();

            return response()->json(['message' => 'Notification marked as read']);
        }

        return response()->json(['message' => 'Notification not found'], 404);
    }

    // Delete a specific notification
    public function destroy($notificationId)
    {
        $userId = Auth::id();
        $notification = Notification::where('id', $notificationId)
                                    ->where('user_id', $userId)
                                    ->first();

        if ($notification) {
            $notification->delete();
            return response()->json(['message' => 'Notification deleted successfully']);
        }

        return response()->json(['message' => 'Notification not found'], 404);
    }
}
