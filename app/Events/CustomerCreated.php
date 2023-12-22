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
use App\Models\Customer;
use App\Models\CustomerCustomFieldValue;
use Illuminate\Support\Facades\Log;

class CustomerCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $customer;
    /* public $customerCustomFieldValue; */

    /**
     * Create a new event instance.
     *
     * @param  Customer  $note  The note information.
     */
    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
        /* $this->CustomerCustomFieldValue = $customerCustomFieldValue; */
    }

/* 
    public function broadcastWith()
    {
        // Load the custom fields and their values
        // Using an existing customer_id from your database for testing
        $customFieldsValues = CustomerCustomFieldValue::where('customer_id', $this->customer->id)
        ->with('customField')
        ->get();
        // Return the data you want to broadcast
        return [
            'customer' => $this->customer,
            // Add the custom fields to the broadcast data
            'customFieldsValues' => $this->customer->customFieldsValues
        ];
    } */

    public function broadcastWith()
    {
        // Load the custom fields and their values
        $this->customer->load(['customFieldsValues.customField']);
    
        // Now, $this->customer->customFieldsValues should contain all related custom field values
        // and each 'customFieldsValue' should have its related 'customField' loaded
    
        // Return the data you want to broadcast
        return [
            'customer' => $this->customer,
            'customFieldsValues' => $this->customer->customFieldsValues
        ];
    }



    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
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
