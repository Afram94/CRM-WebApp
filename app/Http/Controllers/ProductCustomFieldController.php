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
}
