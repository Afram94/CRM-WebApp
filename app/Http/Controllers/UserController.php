<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use App\Events\UserPermissionsUpdated;
use App\Events\UserUpdated;

class UserController extends Controller
{
    /* public function index(Request $request)
    {
        $user = auth()->user();

        $parentUserId = $user->user_id ? $user->user_id : $user->id;
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                            ->orWhere('id', $parentUserId)
                                            ->get();

        return inertia('Users/Show', [
            'auth' => [
                'allUserIdsUnderSameParent' => $allUserIdsUnderSameParent,
                'user' => $user
            ],
        ]);
    } */

    public function index(Request $request)
    {
        $user = auth()->user();
        $search = $request->input('search');

        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Start the query to fetch all users under the same parent
        $query = User::query()->where(function ($query) use ($parentUserId) {
            $query->where('user_id', $parentUserId)
                ->orWhere('id', $parentUserId);
        });

        // If there's a search term, apply filters
        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('email', 'LIKE', '%' . $search . '%')
                    // Add any other fields you'd like to search by
                    ;
            });
        }

        $allUserIdsUnderSameParent = $query->get();

        // If the request is an AJAX call, return the customers as JSON.
        if ($request->wantsJson()) {
            return response()->json([
                'auth' => [
                    'allUserIdsUnderSameParent' => $allUserIdsUnderSameParent,
                    'user' => $user
                ]
            ]);
        }

        return inertia('Users/Show', [
            'auth' => [
                'allUserIdsUnderSameParent' => $allUserIdsUnderSameParent,
                'user' => $user
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


    public function toggleUserActive(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json(['message' => 'User status updated successfully!', 'isActive' => $user->is_active]);
    }

    // In App\Http\Controllers\UserController.php

    public function updateUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        // Validate request data
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $userId,
            'is_active' => 'sometimes|boolean',
            // Add other fields as needed
        ]);

        // Update user details
        $user->update($validated);

        // Broadcast the update
        broadcast(new UserUpdated($user));

        return response()->json(['message' => 'User updated successfully!', 'user' => $user]);
    }


}
