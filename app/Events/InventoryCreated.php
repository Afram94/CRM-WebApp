<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Inventory;

class InventoryCreated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $inventory;

    public function __construct(Inventory $inventory)
    {
        $this->inventory = $inventory;
    }

    public function broadcastOn()
    {
        $userId = $this->inventory->user_id;
        $channels = [];

        if ($userId !== null) {
            $parentUserId = $this->inventory->user->user_id ?? null;
            if ($parentUserId && $userId !== $parentUserId) {
                $channels[] = new PrivateChannel('inventories-for-user-' . $userId);
                $channels[] = new PrivateChannel('inventories-for-user-' . $parentUserId);
            } else {
                $channels[] = new PrivateChannel('inventories-for-user-' . $userId);
            }
        } else {
            $childUsers = User::where('user_id', $this->inventory->user->id)->get();
            $channels[] = new PrivateChannel('inventories-for-user-' . $this->inventory->user->id);
            foreach ($childUsers as $childUser) {
                $channels[] = new PrivateChannel('inventories-for-user-' . $childUser->id);
            }
        }

        return $channels;
    }

    public function broadcastWith()
    {
        // Assuming you have the product relationship loaded
        // You might need to ensure the relationship is loaded or load it here explicitly if not always loaded
        $product = $this->inventory->product;

        return [
            'id' => $this->inventory->id,
            'user_id' => $this->inventory->user_id,
            'product_id' => $this->inventory->product_id,
            'product_name' => $product->name ?? 'N/A', // Assuming product has a 'name' attribute
            'quantity' => $this->inventory->quantity,
            'min_stock_level' => $this->inventory->min_stock_level,
            'max_stock_level' => $this->inventory->max_stock_level,
            'stock_status' => $this->inventory->stock_status,
            'restock_date' => $this->inventory->restock_date,
            'product' => [
                // Add the necessary attributes from your Product model
                'id' => $product->id,
                'name' => $product->name,
                // Continue with other Product attributes as needed
            ],
        ];
    }

}
