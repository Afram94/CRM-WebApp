<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['name' => 'create customer']);
        Permission::create(['name' => 'delete customer']);
        Permission::create(['name' => 'edit customer']);
        Permission::create(['name' => 'view customer']);
        // ...

        // create roles and assign created permissions

        // Super Admin role with all permissions
        $admin = Role::create(['name' => 'superadmin']);
        $admin->givePermissionTo(Permission::all());

        // Admin role with all permissions
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        // User role with limited permissions
        $user = Role::create(['name' => 'user']);
        $user->givePermissionTo([]);
    }
}
