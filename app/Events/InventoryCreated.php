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
        $inventory = $this->inventory->load('product'); // Ensure the product relationship is loaded

        return[
            'inventory' => $this->inventory,
            'product_name' => $inventory->product->name,
        ];
        /* return [
            'id' => $inventory->id,
            'user_id' => $inventory->user_id,
            'quantity' => $inventory->quantity,
            'stock_status' => $inventory->stock_status,
            'restock_date' => $inventory->restock_date,
            'product_name' => $inventory->product->name, // Include the product name
        ]; */
        /* 'product_id' => $inventory->product_id, */
        /* 'min_stock_level' => $inventory->min_stock_level,
        'max_stock_level' => $inventory->max_stock_level, */
    }



}
