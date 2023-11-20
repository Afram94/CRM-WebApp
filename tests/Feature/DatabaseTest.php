<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Customer;
use Database\Seeders\RolesAndPermissionsSeeder;

class DatabaseTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function testBasicRelationships()
    {

        // Create a new User
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create a new Customer with the user_id
        $customer = Customer::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone_number' => '1234567890',
            'user_id' => $user->id, // Use the created user's ID
        ]);

        // Create a new Product
        $product = Product::create([
            'name' => 'Sample Product',
            'description' => 'This is a sample product',
            'price' => 19.99,
            'sku' => 'SKU123',
            'inventory_count' => 100
        ]);

        // Create a new Order
        $order = Order::create([
            'customer_id' => $customer->id,
            'total' => 19.99,
            'status' => 'pending'
        ]);

        // Create a new Order Item
        $orderItem = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => $product->price
        ]);

        // Assertions to verify the relationships
        $this->assertEquals($product->id, $orderItem->product_id);
        $this->assertEquals($order->id, $orderItem->order_id);
        $this->assertEquals($customer->id, $order->customer_id);

        // Clean up: delete created records to maintain a clean state
        $orderItem->delete();
        $order->delete();
        $product->delete();
        $customer->delete();
    }
}