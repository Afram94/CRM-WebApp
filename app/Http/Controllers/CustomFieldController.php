<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\CustomerCustomField;
use App\Models\ProductCustomField;
use App\Models\User;
use Illuminate\Support\Facades\Auth; // Don't forget to import Auth facade


class CustomFieldController extends Controller
{
    /* public function add(Request $request)
    {
        // Get the logged-in user's ID
        $userId = Auth::id();

        // Get the custom field name and type from the request
        $fieldName = $request->input('field_name');
        $fieldType = $request->input('field_type');

        // Create a new entry in the 'customer_custom_fields' table
        $customField = new CustomerCustomField([
            'field_name' => $fieldName,
            'field_type' => $fieldType,
        ]);

        // Associate the custom field with the logged-in user's ID
        $customField->user_id = $userId;

        // Save the custom field
        $customField->save();

        return response()->json(['message' => 'Custom field added']);
    } */

    public function index()
    {
        $authId = auth()->id();

        // Determine if the user is a main user or a child user
        $isMainUser = User::where('id', $authId)->whereNull('user_id')->exists();
        $isChildUser = !$isMainUser;

        // Initialize an empty array for user IDs
        $userIdsForQuery = [];

        // Logic for handling main users
        if ($isMainUser) {
            $childUserIds = User::where('user_id', $authId)->pluck('id')->toArray();
            $userIdsForQuery = array_merge([$authId], $childUserIds);
        }

        // Logic for handling child users
        if ($isChildUser) {
            $mainUserId = User::where('id', $authId)->value('user_id');
            $userIdsForQuery = [$authId, $mainUserId];
        }

        // Fetch CustomerCustomFields and ProductCustomFields
        $customerFields = CustomerCustomField::whereIn('user_id', $userIdsForQuery)->get();
        $productFields = ProductCustomField::whereIn('user_id', $userIdsForQuery)->get();

        // Return the data with Inertia
        return inertia('CustomFields/ShowCustomFields', [
            'auth' => [
                'customer_custom_fields' => $customerFields,
                'product_custom_fields' => $productFields
            ]
        ]);
    }

}
