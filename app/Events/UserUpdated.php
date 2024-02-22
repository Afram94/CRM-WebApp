<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\User;

class UserUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /* public function broadcastOn()
    {
        return new PrivateChannel('users-for-user-' . $this->user->id);
    } */

    /* public function broadcastOn()
    {
        $channels = [];
        
        // Check if the updated user is a child user
        if ($this->user->user_id !== null) {
            // Add channel for the child user itself
            $channels[] = new PrivateChannel('users-for-user-' . $this->user->id);
            // Add channel for the parent (admin) user of the child user
            $channels[] = new PrivateChannel('users-for-user-' . $this->user->user_id);
        } else {
            // This is an admin user, add a channel for the admin
            $channels[] = new PrivateChannel('users-for-user-' . $this->user->id);
            // Add channels for each child user of this admin
            $childUsers = User::where('user_id', $this->user->id)->get();
            foreach ($childUsers as $childUser) {
                $channels[] = new PrivateChannel('users-for-user-' . $childUser->id);
            }
        }

        return $channels;
    } */

    public function broadcastOn()
    {
        $userId = $this->user->user_id;
        $channels = [];

        if ($userId !== null) {
            // This is a child user
            $parentUserId = $this->user->user_id;
            $channels[] = new PrivateChannel('users-for-user-' . $userId);
            $channels[] = new PrivateChannel('users-for-user-' . $parentUserId);
        } else {
            // This is a parent user
            $childUsers = User::where('user_id', $this->user->id)->get();
            $channels[] = new PrivateChannel('users-for-user-' . $this->user->id);
            foreach ($childUsers as $childUser) {
                $channels[] = new PrivateChannel('users-for-user-' . $childUser->id);
            }
        }

        return $channels;
    }


    public function broadcastWith()
    {
        /* dd($this->user->id); */
        return ['user' => $this->user];
    }
}

