<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerCustomField;
use App\Models\User;


class CustomerCustomFieldController extends Controller
{
    public function store(Request $request)
    {
        $customField = new CustomerCustomField([
            'field_name' => $request->input('field_name'),
            'field_type' => $request->input('field_type'),
            'user_id' => auth()->id(),
        ]);

        $customField->save();

        return response()->json($customField);
    }

    public function index()
    {
        // Get the ID of the authenticated user
        $authId = auth()->id();

        // Fetch the user_id from the users table where the id matches the authId
        // The value method retrieves the user_id value directly without fetching the entire row
        $userIdOfSameAuth = User::where('id', $authId)->value('user_id');

        // Fetch entries from CustomerCustomField for both authId and userIdOfSameAuth
        $fields = CustomerCustomField::whereIn('user_id', [$authId, $userIdOfSameAuth])->get();

        return response()->json($fields);
    }

}
