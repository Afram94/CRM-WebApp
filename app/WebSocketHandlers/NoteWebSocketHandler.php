<?php

namespace App\WebSocketHandlers;

use BeyondCode\LaravelWebSockets\WebSockets\WebSocketHandler;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use App\Events\NoteCreated;
use App\Models\Note;


class NoteWebSocketHandler extends WebSocketHandler
{
    public function onOpen(ConnectionInterface $connection)
    {
        // Authentication logic here
        // $connection->user = $this->authenticateUser($request);
        parent::onOpen($connection);
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $message)
    {
        // Decode the incoming message to an associative array.
        $data = json_decode($message->getPayload(), true);
        
        if (isset($data['action']) && $data['action'] === 'new_note') {
            // Assume $data['note'] contains the note information
            
            // Your logic to save or manipulate the note, for example:
            // $newNote = Note::create($data['note']);

            $newNote = Note::create($data['note']); // Ensure this is saving the note.
            
            // Then broadcast event
            /* broadcast(new NoteCreatedEvent($data['note'])); */
            broadcast(new NoteCreated($newNote));

        }
    }

    public function onClose(ConnectionInterface $connection)
    {
        parent::onClose($connection);
    }
}
