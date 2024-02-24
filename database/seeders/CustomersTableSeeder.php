<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        $customFields = [
            ['field_name' => 'Custom Field 1', 'field_type' => 'text'],
            ['field_name' => 'Custom Field 2', 'field_type' => 'text'],
            ['field_name' => 'Custom Field 3', 'field_type' => 'text'],
            ['field_name' => 'Custom Field 4', 'field_type' => 'text'],
            ['field_name' => 'Custom Field 5', 'field_type' => 'text'],
            ['field_name' => 'Custom Field 6', 'field_type' => 'text'],
            ['field_name' => 'Custom Field 7', 'field_type' => 'text'],
            // Add more custom fields if needed
        ];
        
        $fieldIds = [];
        
        foreach ($customFields as $field) {
            $fieldIds[] = DB::table('customer_custom_fields')->insertGetId([
                'user_id' => 1, // or any specific user ID
                'field_name' => $field['field_name'],
                'field_type' => $field['field_type'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        // Seed Customer Custom Field Values
        foreach ($customers as $customer) {
            foreach ($fieldIds as $fieldId) {
                DB::table('customer_custom_field_values')->insert([
                    'customer_id' => $customer['id'],
                    'field_id' => $fieldId,
                    'value' => 'Sample Value', // You can customize this value as needed
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
