<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductCustomField;
use App\Models\User;

class ProductCustomFieldController extends Controller
{
    public function store(Request $request)
    {
        $customField = new ProductCustomField([
            'field_name' => $request->input('field_name'),
            'field_type' => $request->input('field_type'),
            'is_required' => $request->input('is_required'),
            'user_id' => auth()->id(),
        ]);

        $customField->save();

        return response()->json($customField);
    }

    public function index()
    {
        $authId = auth()->id();

        $isMainUser = User::where('id', $authId)->whereNull('user_id')->exists();
        $isChildUser = !$isMainUser;

        $userIdsForQuery = [];

        if ($isMainUser) {
            $childUserIds = User::where('user_id', $authId)->pluck('id')->toArray();
            $userIdsForQuery = array_merge([$authId], $childUserIds);
        }

        if ($isChildUser) {
            $mainUserId = User::where('id', $authId)->value('user_id');
            $userIdsForQuery = [$authId, $mainUserId];
        }

        $fields = ProductCustomField::whereIn('user_id', $userIdsForQuery)->get();

        return response()->json($fields);
    }

    public function update(Request $request, $id)
    {
        // Find the custom field or fail if not found
        $customField = ProductCustomField::findOrFail($id);


        $user = auth()->user();
        // Determine the parent user ID (it's either the user's own ID or their parent's ID)
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();


        // Check if custom-field exists and belongs to the authenticated user and the users that belongs to it
        if (!$customField || !in_array($customField->user_id, $allUserIdsUnderSameParent)) {
            return response()->json(['error' => 'customField not found or not authorized'], 403);
        }

        // Validate the request data
        $validatedData = $request->validate([
            'field_name' => 'required|string|max:255',
            'field_type' => 'required|string|max:255',
        ]);

        // Update the custom field
        $customField->update($validatedData);

        // Return a success response
        return response()->json(['message' => 'Custom field updated successfully', 'customField' => $customField]);
    }

    public function destroy(Request $request, $id){
        // Find the custom field or fail if not found
        $customField = ProductCustomField::findOrFail($id);

        $user = auth()->user();
        // Determine the parent user ID (it's either the user's own ID or their parent's ID)
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();


        // Check if custom-field exists and belongs to the authenticated user and the users that belongs to it
        if (!$customField || !in_array($customField->user_id, $allUserIdsUnderSameParent)) {
            return response()->json(['error' => 'customField not found or not authorized'], 403);
        }

        $customField->delete();

        return response()->json(['message' => 'Custom field deleted successfully', 'customField' => $customField]);
    }
}
