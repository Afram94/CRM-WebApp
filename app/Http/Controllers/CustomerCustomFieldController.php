<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerCustomField;
use App\Models\User;


class CustomerCustomFieldController extends Controller
{

    /* The Index Function is located in the "CustomFieldController".
    It is specifically designed to handle the indexing and display of all custom fields related to customers, products,
    and other entities managed within the CustomFieldController. */


    public function store(Request $request)
    {
        $customField = new CustomerCustomField([
            'field_name' => $request->input('field_name'),
            'field_type' => $request->input('field_type'),
            'is_required' => $request->input('is_required'),
            'user_id' => auth()->id(),
        ]);

        $customField->save();

        return response()->json($customField);
    }

    public function getCustomerCustomFields()
    {
        // Get the ID of the authenticated user
        $authId = auth()->id();

        // Check if this user is a main user by looking for an entry with the same 'id' 
        // and where 'user_id' is null. If found, this user is considered a "main" user.
        $isMainUser = User::where('id', $authId)->whereNull('user_id')->exists();
        // If the user is not a main user, then it's assumed to be a child user.
        $isChildUser = ! $isMainUser;

        // Initialize an empty array to hold user IDs that will be used for querying the custom fields.
        $userIdsForQuery = [];

        // Logic for handling main users
        if ($isMainUser) {
            // Fetch IDs of all child users whose 'user_id' matches the main user's 'id'.
            // The pluck method retrieves all values for the given column ('id' in this case) and 
            // converts them into an array.
            $childUserIds = User::where('user_id', $authId)->pluck('id')->toArray();

            // Combine the main user's ID with the child user IDs.
            // array_merge is used to merge the IDs into a single array.
            $userIdsForQuery = array_merge([$authId], $childUserIds);
        }

        // Logic for handling child users
        if ($isChildUser) {
            // Fetch the ID of the main user by finding the value in 'user_id' column
            // for the authenticated user.
            $mainUserId = User::where('id', $authId)->value('user_id');

            // Set the IDs for query to include both the child user and its main user.
            $userIdsForQuery = [$authId, $mainUserId];
        }

        // Finally, fetch custom fields from CustomerCustomField that match any of the user IDs.
        // The whereIn method filters the query by the 'user_id' column based on the array of IDs.
        $fields = CustomerCustomField::whereIn('user_id', $userIdsForQuery)->get();

        // Return the custom fields as a JSON response.
        return response()->json($fields);
    }

    public function update(Request $request, $id)
    {
        // Find the custom field or fail if not found
        $customField = CustomerCustomField::findOrFail($id);


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
        $customField = CustomerCustomField::findOrFail($id);

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
