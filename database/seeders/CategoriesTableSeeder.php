<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
    }
}
