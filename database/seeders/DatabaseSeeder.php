<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $users = [];
        $adminIds = [];

        // First, create all admin users
        for ($i = 1; $i <= 100; $i += 4) {
            $users[] = [
                'id' => $i, 
                'user_id' => null, 
                'name' => 'Admin_' . ceil($i / 4),
                'email' => 'admin_' . ceil($i / 4) . '@example.com',
                'password' => Hash::make('password')
            ];
            $adminIds[] = $i;
        }

        // Then, create all child users
        foreach ($adminIds as $adminId) {
            for ($j = 1; $j <= 3; $j++) {
                $childId = $adminId + $j;
                if ($childId > 100) break; // Ensure not to exceed 100 users

                $users[] = [
                    'id' => $childId, 
                    'user_id' => $adminId,
                    'name' => 'child_to_admin_' . ceil($adminId / 4),
                    'email' => 'john_' . $childId . '@example.com',
                    'password' => Hash::make('password')
                ];
            }
        }

        // Insert users into the database
        foreach ($users as $user) {
            $createdUserId = DB::table('users')->insertGetId([
                'id' => $user['id'],
                'user_id' => $user['user_id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => $user['password'],
            ]);

            // Assign roles to users
            $role = is_null($user['user_id']) ? 'admin' : 'user';
            Role::findByName($role)->users()->attach($createdUserId);
        }

        // Array of Customers
        $customers = [];
        for ($i = 1; $i <= 100; $i++) {
            $customers[] = [
                'id' => $i,
                'user_id' => $i, // Assuming each customer is linked to a user
                'name' => 'Customer ' . $i,
                'email' => 'customer' . $i . '@example.com',
                'phone_number' => '123456' . str_pad($i, 4, "0", STR_PAD_LEFT),
            ];
        }
        DB::table('customers')->insert($customers);

        // Seed the Categories table
        $categories = [];
        for ($i = 1; $i <= 100; $i++) {
            $categories[] = [
                'id' => $i,
                'user_id' => $i,
                'name' => 'Category ' . $i,
                'description' => 'Description for Category ' . $i,
            ];
        }
        DB::table('categories')->insert($categories);

        // Array of Products
        $products = [];
        for ($i = 1; $i <= 100; $i++) {
            $products[] = [
                'id' => $i,
                'user_id' => $i, // Assuming each product is linked to a user
                'category_id' => $i, // Assigning each product to a category
                'name' => 'Product ' . $i,
                'description' => 'Description ' . $i,
                'price' => rand(10, 100), // Random price between 10 and 100
            ];
        }
        DB::table('products')->insert($products);




        // Array of Orders
        $orders = [];
        for ($i = 1; $i <= 100; $i++) {
            $orders[] = [
                'id' => $i,
                'user_id' => $i, // Assuming each order is linked to a user
                'customer_id' => $i, // Assuming each order is linked to a customer
                'total' => rand(100, 500), // Random total amount
                'status' => $i % 2 == 0 ? 'completed' : 'pending', // Alternate status
            ];
        }
        DB::table('orders')->insert($orders);

     
        $productVariants = [];
        for ($i = 1; $i <= 50; $i++) {
            $productVariants[] = [
                'user_id' => rand(1, 10), // Assuming you have users 1-10
                'product_id' => rand(1, 10), // Assuming you have products 1-10
                'variant_name' => 'Size', // Example variant name
                'variant_value' => $i % 2 == 0 ? 'Large' : 'Small', // Alternating values
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('product_variants')->insert($productVariants);



        $serialNumbers = [];
        for ($i = 1; $i <= 100; $i++) {
            $serialNumbers[] = [
                'user_id' => rand(1, 10), // Assuming you have users 1-10
                'product_variant_id' => rand(1, 50), // Assuming you have product variants 1-50
                'serial_number' => 'SN' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('serial_numbers')->insert($serialNumbers);
        


        $orderItems = [];
        for ($i = 1; $i <= 100; $i++) {
            $orderItems[] = [
                'order_id' => rand(1, 30), // Assuming you have orders 1-30
                'product_id' => rand(1, 10), // Assuming you have products 1-10
                'product_variant_id' => rand(1, 50), // Assuming you have product variants 1-50
                'quantity' => rand(1, 5), // Random quantity
                'price' => rand(100, 1000) / 100, // Random price
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('order_items')->insert($orderItems);


        // Array of Inventory
        $inventories = [];
        for ($i = 1; $i <= 100; $i++) {
            $inventories[] = [
                'id' => $i,
                'user_id' => $i, // Assuming each inventory record is linked to a user
                'product_id' => $i, // Assuming each inventory record is linked to a product
                'product_variant_id' => rand(1, 10), // Assuming 10 variants, randomly assign
                'quantity' => rand(10, 200), // Random quantity
                'stock_status' => 'in_stock', // Assuming all are in stock
                'min_stock_level' => rand(5, 20), // Random minimum stock level
                'max_stock_level' => rand(100, 500), // Random maximum stock level
                'restock_date' => now()->addDays(rand(10, 60))->format('Y-m-d'), // Random restock date in the future
            ];
        }
        DB::table('inventories')->insert($inventories);

        

        // ... Repeat for other tables as necessary
    }
}
