<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerCustomFieldValue;
use App\Models\Customer;  // Importing the Customer model

class CustomerCustomFieldValueController extends Controller
{
    public function store(Request $request, $customerId)
    {
        $customFields = $request->input('custom_fields');

        // Fetch the customer from the database
        $customer = Customer::findOrFail($customerId);

        foreach ($customFields as $fieldId => $value) {
            $customFieldValue = new CustomerCustomFieldValue();
            $customFieldValue->customer_id = $customerId;
            $customFieldValue->field_id = $fieldId; // Make sure to set this!
            $customFieldValue->value = $value;

            // If you want to set the user_id, do it here
            /* $customFieldValue->user_id = auth()->id(); */

            $customFieldValue->save();
        }

        return response()->json(['message' => 'Custom fields saved successfully']);
    }
}
