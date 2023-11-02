<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\Event;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;

    public function __construct($notification)
    {
        $this->notification = $notification;
    }

    public function broadcastWith()
    {
        /* // Decode the data JSON string into an array
        $decodedData = json_decode($this->notification->data, true); */

        return [
            'notification' => [
                'id' => $this->notification->id,
                'note_id' => $this->notification->data['note_id'], // Accessing the note_id from the data property
                'note_title' => $this->notification->data['note_title'], // Accessing the note_title from the data property
            ],
        ];
    }

    public function broadcastOn()
    {
        return new Channel('new-notification');
    }
}
