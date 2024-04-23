<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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

    public function index(Request $request)
    {
        /* Log::info('Entered Notification index method'); */
        $user = Auth::user(); // Using Auth facade for clarity
        if (!$user) {
            /* Log::info('No authenticated user.'); */
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $notifications = $user->notifications()->where('seen', false)->get();
    
        Log::info('Notifications: ' . $notifications->toJson()); // This will log the fetched notifications
    
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
