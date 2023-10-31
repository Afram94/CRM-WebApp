<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Note;

class NoteCreated implements ShouldBroadcast  // Notice the ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $note;  // Declare the note property

    /**
     * Create a new event instance.
     *
     * @param  Note  $note  The note information.
     */
    public function __construct(Note $note)
    {
        $this->note = $note;
    }

    /**
     * The data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        // Eager load user and customer data
        $this->note->load(['user:id,name', 'customer:id,name']);
        
        // Set the customer_name and user_name from the loaded relationships
        $this->note->customer_name = $this->note->customer->name;
        $this->note->user_name = $this->note->user->name;

        // Return the flattened note structure
        return [
            'note' => [
                'id' => $this->note->id,
                'customer_id' => $this->note->customer_id,
                'user_id' => $this->note->user_id,
                'title' => $this->note->title,
                'content' => $this->note->content,
                'created_at' => $this->note->created_at,
                'updated_at' => $this->note->updated_at,
                'customer_name' => $this->note->customer_name,
                'user_name' => $this->note->user_name,
            ],
        ];
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('new-note');
    }
}
