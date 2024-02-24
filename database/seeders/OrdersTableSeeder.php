<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
    }
}
