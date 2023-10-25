<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerCustomField;

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
        $fields = CustomerCustomField::where('user_id', auth()->id())->get();
        return response()->json($fields);
    }
}
