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
use App\Models\User;

class NoteDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $noteId;
    public $userId;

    /**
     * Create a new event instance.
     *
     * @param  int  $noteId  The ID of the deleted note.
     * @param  int  $userId  The ID of the user who owns the note.
     */
    public function __construct($noteId, $userId)
    {
        $this->noteId = $noteId;
        $this->userId = $userId;
    }

    public function broadcastWith()
    {
        return ['noteId' => $this->noteId];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new PrivateChannel('notes-for-user-' . $this->userId);
    }
}
