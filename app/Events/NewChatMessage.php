<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewChatMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastWith()
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'from_user_id' => $this->message->from_user_id,
                'to_user_id' => $this->message->to_user_id,
                'message' => $this->message->message, // Assuming the column is named 'message'
                'created_at' => $this->message->created_at,
                // Add more fields as needed
            ],
        ];
    }


    public function broadcastOn()
    {
        return [
            new PrivateChannel('chat.' . $this->message->from_user_id),
            new PrivateChannel('chat.' . $this->message->to_user_id),
        ];
    }
}
