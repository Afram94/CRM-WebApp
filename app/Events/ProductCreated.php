<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductCustomFieldValue;
use Illuminate\Support\Facades\Log;

class ProductCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $product;
    /**
     * Create a new event instance.
     * * @param  Product
     */
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function broadcastWith()
    {
        // Load the custom fields and their values
        $this->product->load(['customFieldsValues.customField']);
    
        return [
            'product' => $this->product,
            'customFieldsValues' => $this->product->customFieldsValues,
        ];
    }


    public function broadcastOn()
    {
        $userId = $this->product->user_id;
        $channels = [];

        if ($userId !== null) {
            // This is a child user
            $parentUserId = $this->product->user->user_id;
            $channels[] = new PrivateChannel('products-for-user-' . $userId);
            $channels[] = new PrivateChannel('products-for-user-' . $parentUserId);
        } else {
            // This is a parent user
            $childUsers = User::where('user_id', $this->product->user->id)->get();
            $channels[] = new PrivateChannel('products-for-user-' . $this->product->user->id);
            foreach ($childUsers as $childUser) {
                $channels[] = new PrivateChannel('products-for-user-' . $childUser->id);
            }
        }

        return $channels;
    }
}
