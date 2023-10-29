<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
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
     * @param  array  $note  The note information.
     */

    public function __construct(Note $note)
    {
        $this->note = $note->toArray();
    }

    /**
     * The data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'note' => $this->note,
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // Update this to be a meaningful channel, maybe based on the user ID or note ID.
        return new PrivateChannel('note-channel-' . $this->note['id']);
    }
}
