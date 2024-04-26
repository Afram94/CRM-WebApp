<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Inventory;
use App\Models\User;

class InventoryUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $inventory;

    /**
     * Create a new event instance.
     *
     * @param  Inventory  $inventory  The updated inventory information.
     * @param  Inventory  $originalInventory  The original inventory information before update.
     */
    public function __construct(Inventory $inventory)
    {
        $this->inventory = $inventory;
    }

    public function broadcastWith()
    {
        $inventory = $this->inventory->load('product'); // Ensure the product relationship is loaded

        return[
            'inventory' => $this->inventory,
            'product_name' => $inventory->product->name,
        ];
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
}
