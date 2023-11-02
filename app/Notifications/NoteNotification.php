<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NoteNotification extends Notification
{
    use Queueable;

    protected $note;

    /**
     * Create a new notification instance.
     */
    public function __construct($note)
    {
        $this->note = $note;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database']; // Added 'database' here
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('A new note has been created.')
                    ->action('View Note', url('/notes/' . $this->note->id))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'note_id' => $this->note->id,
            'note_title' => $this->note->title,
            'note_content' => $this->note->content,
            'message' => 'A new note has been created.'
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'note_id' => $this->note->id,
            'note_title' => $this->note->title,
        ];
    }
}
