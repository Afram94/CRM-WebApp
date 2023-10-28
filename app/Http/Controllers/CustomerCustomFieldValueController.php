<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerCustomFieldValue;
use App\Models\Customer;
use App\Models\CustomerCustomField;

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


    public function update(Request $request, $customerId)
    {
        // Ensure the Customer exists
        $customer = Customer::findOrFail($customerId);

        $customFieldValues = $request->input('custom_fields', []);

        foreach ($customFieldValues as $id => $value) {
            // Check if the field_id exists in customer_custom_fields
            $fieldDefinitionExists = CustomerCustomField::find($id);

            if (!$fieldDefinitionExists) {
                return response()->json(['error' => "Field ID $id not found"], 400);
            }

            // Fetch or create a new field value based on customer_id and field_id
            $fieldValue = CustomerCustomFieldValue::firstOrNew([
                'customer_id' => $customerId,
                'field_id' => $id,
            ]);

            //here if i want to make the value null or empty again
            //check then if is good to have an empty value
            $fieldValue->value = $value ?? '';  // If value is null, set to empty string


            /* $fieldValue->value = $value; */
            $fieldValue->save();
        }

        return response()->json(['message' => 'Custom fields updated successfully']);
    }





}
