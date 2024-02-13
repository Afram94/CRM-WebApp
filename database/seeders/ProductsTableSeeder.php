<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
    }
}
