<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [];
        $adminIds = [];

        // First, create all admin users
        for ($i = 1; $i <= 100; $i += 41) {
            $users[] = [
                'id' => $i, 
                'user_id' => null, 
                'name' => 'Admin_' . ceil($i / 41),
                'email' => 'admin_' . $i . '@example.com', // Use the user ID directly
                'password' => Hash::make('password')
            ];
            $adminIds[] = $i;
        }

        // Then, create all child users
        foreach ($adminIds as $adminId) {
            for ($j = 1; $j <= 40; $j++) {
                $childId = $adminId + $j;
                if ($childId > 100) break; // Ensure not to exceed 100 users

                $users[] = [
                    'id' => $childId, 
                    'user_id' => $adminId,
                    'name' => 'child_to_admin_' . ceil($adminId / 41),
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
    }
}
