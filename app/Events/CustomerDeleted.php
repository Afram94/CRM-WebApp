<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Customer;
use App\Models\User;

class CustomerDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $customerId;
    public $userId;

    /**
     * Create a new event instance.
     */
    public function __construct($customerId, $userId)
    {
        /* dd($this->customer); */
        $this->customerId = $customerId;
        $this->userId = $userId;
    }

    /* public function broadcastWith()
    {
        return ['customerId' => $this->customerId];
    } */

    public function broadcastWith()
    {
        return ['customerId' => $this->customerId];
    }


    public function broadcastOn()
    {
        return new PrivateChannel('customers-for-user-' . $this->userId);
    }
}
