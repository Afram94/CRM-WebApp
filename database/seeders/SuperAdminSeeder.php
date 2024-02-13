<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Models\User;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure the superadmin role exists
        $role = Role::firstOrCreate(['name' => 'superadmin']);

        // Create a superadmin user or find an existing one
        $superAdmin = User::firstOrCreate([
            'email' => env('SUPER_ADMIN_EMAIL'),
        ], [
            'name' => 'Super Admin',
            'password' => Hash::make(env('SUPER_ADMIN_PASSWORD')), // Use a secure password
        ]);

        // Assign the superadmin role
        $superAdmin->assignRole($role);
    }
}
