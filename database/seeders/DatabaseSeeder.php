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
        $this->call([
            UsersTableSeeder::class,
            CategoriesTableSeeder::class,
            CustomersTableSeeder::class,
            CustomFieldsTableSeeder::class,
            ProductsTableSeeder::class,
            OrdersTableSeeder::class,
            OrderItemsTableSeeder::class,
            InventoriesTableSeeder::class,
            SuperAdminSeeder::class,
            // Add any other seeders here
        ]);
    }
}
