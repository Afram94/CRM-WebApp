<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Array of Inventory
         $inventories = [];
         for ($i = 1; $i <= 100; $i++) {
             $inventories[] = [
                 'id' => $i,
                 'user_id' => $i, // Assuming each inventory record is linked to a user
                 'product_id' => $i, // Assuming each inventory record is linked to a product
                 /* 'product_variant_id' => rand(1, 10), // Assuming 10 variants, randomly assign */
                 'quantity' => rand(10, 200), // Random quantity
                 'stock_status' => 'in_stock', // Assuming all are in stock
                 'min_stock_level' => rand(5, 20), // Random minimum stock level
                 'max_stock_level' => rand(100, 500), // Random maximum stock level
                 'restock_date' => now()->addDays(rand(10, 60))->format('Y-m-d'), // Random restock date in the future
             ];
         }
         DB::table('inventories')->insert($inventories);
 
    }
}
