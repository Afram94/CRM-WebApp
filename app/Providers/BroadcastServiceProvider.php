<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;
use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Broadcast::routes();

        require base_path('routes/channels.php');

        // Define your WebSocket routes here
        WebSocketsRouter::webSocket('/app', \App\WebSocketHandlers\NoteWebSocketHandler::class);
    }
}
