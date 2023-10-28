<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\CustomerCustomField;
use Illuminate\Support\Facades\Auth; // Don't forget to import Auth facade


class CustomFieldController extends Controller
{
    public function add(Request $request)
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
    }
}
