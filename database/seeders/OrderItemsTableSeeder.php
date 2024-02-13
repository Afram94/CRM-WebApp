<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orderItems = [];
        for ($i = 1; $i <= 100; $i++) {
            $orderItems[] = [
                'order_id' => rand(1, 30), // Assuming you have orders 1-30
                'product_id' => rand(1, 10), // Assuming you have products 1-10
                /* 'product_variant_id' => rand(1, 50), // Assuming you have product variants 1-50 */
                'quantity' => rand(1, 5), // Random quantity
                'price' => rand(100, 1000) / 100, // Random price
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('order_items')->insert($orderItems);
    }
}
