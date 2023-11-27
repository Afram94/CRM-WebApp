<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Order;
use App\Models\Inventory;

class CRMOpsTest extends TestCase
{
    use RefreshDatabase;

    public function testCRUDOperations()
    {
        // Assuming user_id 1 already exists, if not, create it
        $user = User::find(1) ?? User::factory()->create(['id' => 1]);
        
        // Create a customer
        $customer = Customer::create([
            'user_id' => 1,
            'name' => 'Test Customer',
            'email' => 'customer@test.com',
            'phone_number' => '000000000',
            // other necessary fields...
        ]);
        
        // Create a product
        $product = Product::create([
            'user_id' => 1,
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 99.99,
            // other necessary fields...
        ]);
        
        // Create an order
        $order = Order::create([
            'customer_id' => $customer->id,
            'user_id' => 1,
            'total' => 199.98,
            'status' => 'pending',
            // other necessary fields...
        ]);
        
        // Add inventory
        $inventory = Inventory::create([
            'user_id' => 1,
            'product_id' => $product->id,
            'quantity' => 50,
            'stock_status' => 'in_stock',
            // other necessary fields...
        ]);
        
        // Assertions
        $this->assertDatabaseHas('customers', ['id' => $customer->id]);
        $this->assertDatabaseHas('products', ['id' => $product->id]);
        $this->assertDatabaseHas('orders', ['id' => $order->id]);
        $this->assertDatabaseHas('inventories', ['id' => $inventory->id]);
        
        // More detailed tests can be added to check the relations and specific attributes
        // For example, check if inventory is reduced after an order is placed, etc.
    }
}
