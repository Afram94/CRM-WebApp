<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Product;

class ProductCreated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function broadcastWith()
    {
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
            $parentUserId = $this->product->user->user_id;
            if ($userId !== $parentUserId) {
                $channels[] = new PrivateChannel('products-for-user-' . $userId);
                $channels[] = new PrivateChannel('products-for-user-' . $parentUserId);
            } else {
                $channels[] = new PrivateChannel('products-for-user-' . $userId);
            }
        } else {
            $childUsers = User::where('user_id', $this->product->user->id)->get();
            $channels[] = new PrivateChannel('products-for-user-' . $this->product->user->id);
            foreach ($childUsers as $childUser) {
                $channels[] = new PrivateChannel('products-for-user-' . $childUser->id);
            }
        }

        return $channels;
    }
}
