<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use App\Events\UserPermissionsUpdated;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $parentUserId = $user->user_id ? $user->user_id : $user->id;
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                            ->orWhere('id', $parentUserId)
                                            /* ->pluck('name')->toArray(); */
                                            ->get();

        /* dd($allUserIdsUnderSameParent); */

        return inertia('Users/Show', [
            'auth' => [
                'allUserIdsUnderSameParent' => $allUserIdsUnderSameParent,
                /* 'customers' => $customers */
            ],
        ]);
    }

    public function getTheCurrentUser()
{
    $user = auth()->user();

    if (!$user) {
        return response()->json(['error' => 'Unauthenticated'], 401);
    }

    return response()->json($user, 200);
}

    public function getRoles()
    {
        $user = auth()->user();
        $roles = $user->getRoleNames();  // Returns a collection

        return response()->json(['roles' => $roles]);
    }


    public function getPermissions($id)
    {
        $user = User::findOrFail($id);
        $allPermissions = Permission::all();

        $response = [];

        foreach ($allPermissions as $permission) {
            $response[] = [
                'id' => $permission->id,
                'name' => $permission->name,
                'hasPermission' => $user->hasPermissionTo($permission->name)
            ];
        }

        return response()->json($response);
    }

    public function updatePermissions(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $updatedPermissionIds = $request->input('permissions', []);

        // Clear all current direct permissions and set new ones
        $user->permissions()->detach();
        $permissions = Permission::whereIn('id', $updatedPermissionIds)->get();

        $user->givePermissionTo($permissions);

        $updatedPermissions = $user->permissions->pluck('name');
    
        broadcast(new UserPermissionsUpdated($userId, $updatedPermissions));

        return response()->json(['message' => 'Permissions updated']);
    }


    public function togglePermission($userId, $permissionId)
    {
        $user = User::findOrFail($userId);
        $permission = Permission::findById($permissionId);
        
        if ($user->hasPermissionTo($permission)) {
            $user->revokePermissionTo($permission);
        } else {
            $user->givePermissionTo($permission);
        }

        $updatedPermissions = $user->permissions->pluck('name');

        broadcast(new UserPermissionsUpdated($userId, $updatedPermissions));
    
        return response()->json(['message' => 'Permission toggled']);
    }
}
