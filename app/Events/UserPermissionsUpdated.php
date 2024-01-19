<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserPermissionsUpdated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $userId;
    public $permissions;

    public function __construct($userId, $permissions)
    {
        $this->userId = $userId;
        $this->permissions = $permissions;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('permissions-for-user.' . $this->userId);
    }
}
