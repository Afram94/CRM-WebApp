<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Customer;
use App\Models\User;

class CustomerUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $customer;

    /**
     * Create a new event instance.
     *
     * @param  Customer  $customer  The updated customer information.
     * @param  Customer  $originalCustomer  The original customer information before update.
     */
    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    public function broadcastWith()
    {
        // Load the custom fields and their values
        $this->customer->load(['customFieldsValues.customField']);
        
        return [
            'customer' => $this->customer,
            /* 'customFieldsValues' => $this->customer->customFieldsValues */
        ];
    }

    public function broadcastOn()
    {
        $userId = $this->customer->user_id;
        $channels = [];

        if ($userId !== null) {
            // This is a child user
            $parentUserId = $this->customer->user->user_id;
            $channels[] = new PrivateChannel('customers-for-user-' . $userId);
            $channels[] = new PrivateChannel('customers-for-user-' . $parentUserId);
        } else {
            // This is a parent user
            $childUsers = User::where('user_id', $this->customer->user->id)->get();
            $channels[] = new PrivateChannel('customers-for-user-' . $this->customer->user->id);
            foreach ($childUsers as $childUser) {
                $channels[] = new PrivateChannel('customers-for-user-' . $childUser->id);
            }
        }

        return $channels;
    }
}
