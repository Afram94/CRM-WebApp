<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserCreated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function broadcastWith()
    {
        /* $this->user->load(['customFieldsValues.customField']); */
        return [
            'user' => $this->user,
            /* 'customFieldsValues' => $this->customer->customFieldsValues */
        ];
    }

    public function broadcastOn()
    {
        $userId = $this->user->user_id;
        $channels = [];

        if ($userId !== null) {
            $parentUserId = $this->user->user->user_id;
            if ($userId !== $parentUserId) {
                $channels[] = new PrivateChannel('users-for-user-' . $userId);
                $channels[] = new PrivateChannel('users-for-user-' . $parentUserId);
            } else {
                $channels[] = new PrivateChannel('users-for-user-' . $userId);
            }
        } else {
            $childUsers = User::where('user_id', $this->user->user->id)->get();
            $channels[] = new PrivateChannel('users-for-user-' . $this->user->user->id);
            foreach ($childUsers as $childUser) {
                $channels[] = new PrivateChannel('users-for-user-' . $childUser->id);
            }
        }

        return $channels;
    }
}
