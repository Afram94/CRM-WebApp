<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Customer;

class CustomerCreated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $customer;

    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    public function broadcastWith()
    {
        $this->customer->load(['customFieldsValues.customField']);
        return [
            'customer' => $this->customer,
            'customFieldsValues' => $this->customer->customFieldsValues
        ];
    }

    public function broadcastOn()
    {
        $userId = $this->customer->user_id;
        $channels = [];

        if ($userId !== null) {
            $parentUserId = $this->customer->user->user_id;
            if ($userId !== $parentUserId) {
                $channels[] = new PrivateChannel('customers-for-user-' . $userId);
                $channels[] = new PrivateChannel('customers-for-user-' . $parentUserId);
            } else {
                $channels[] = new PrivateChannel('customers-for-user-' . $userId);
            }
        } else {
            $childUsers = User::where('user_id', $this->customer->user->id)->get();
            $channels[] = new PrivateChannel('customers-for-user-' . $this->customer->user->id);
            foreach ($childUsers as $childUser) {
                $channels[] = new PrivateChannel('customers-for-user-' . $childUser->id);
            }
        }

        return $channels;
    }
}
