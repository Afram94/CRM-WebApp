<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerCustomFieldValue;
use App\Models\Customer;
use App\Models\CustomerCustomField;
use Illuminate\Validation\ValidationException;

class CustomerCustomFieldValueController extends Controller
{
    

    public function store(Request $request, $customerId)
    {
        $customFields = $request->input('custom_fields');

        // Prepare validation rules dynamically based on custom fields
        $validationRules = [];
        foreach ($customFields as $fieldId => $value) {
            $fieldDefinition = CustomerCustomField::find($fieldId);
            
            if (!$fieldDefinition) {
                // Directly throw an error if the field ID is not found
                throw ValidationException::withMessages([
                    "custom_fields.$fieldId" => ["Field ID $fieldId not found"]
                ]);
            }

            // Set validation rules based on the field's type
            switch ($fieldDefinition->field_type) {
                case 'string':
                    $validationRules["custom_fields.$fieldId"] = 'required|string';
                    break;
                case 'integer':
                    $validationRules["custom_fields.$fieldId"] = 'required|numeric';
                    break;
                case 'date':
                    $validationRules["custom_fields.$fieldId"] = 'required|date';
                    break;
                case 'boolean':
                    $validationRules["custom_fields.$fieldId"] = 'required|boolean';
                    break;
                // ... add other cases as needed
                default:
                    $validationRules["custom_fields.$fieldId"] = 'required|string';
            }
        }

        // Validate the input
        $request->validate($validationRules);

        // Fetch the customer from the database
        $customer = Customer::findOrFail($customerId);

        foreach ($customFields as $fieldId => $value) {
            $customFieldValue = new CustomerCustomFieldValue();
            $customFieldValue->customer_id = $customerId;
            $customFieldValue->field_id = $fieldId; // Make sure to set this!
            $customFieldValue->value = $value;
            $customFieldValue->save();
        }

        return response()->json(['message' => 'Custom fields saved successfully']);
    }



    public function update(Request $request, $customerId)
    {
        // Ensure the Customer exists
        $customer = Customer::findOrFail($customerId);

        $customFieldValues = $request->input('custom_fields', []);

        // Prepare validation rules dynamically based on custom fields
        $validationRules = [];
        foreach ($customFieldValues as $id => $value) {
            $fieldDefinition = CustomerCustomField::find($id);
            
            if (!$fieldDefinition) {
                // Directly throw an error if the field ID is not found
                throw ValidationException::withMessages([
                    "custom_fields.$id" => ["Field ID $id not found"]
                ]);
            }

            // Set validation rules based on the field's type
            switch ($fieldDefinition->field_type) {
                case 'string':
                    $validationRules["custom_fields.$id"] = 'required|string';
                    break;
                case 'integer':
                    $validationRules["custom_fields.$id"] = 'required|numeric';
                    break;
                case 'date':
                    $validationRules["custom_fields.$id"] = 'required|date';
                    break;
                case 'boolean':
                    $validationRules["custom_fields.$fieldId"] = 'required|boolean';
                    break;
                // ... add other cases as needed
                default:
                    $validationRules["custom_fields.$id"] = 'required|string';
            }
        }

        // Validate the input
        $request->validate($validationRules);

        foreach ($customFieldValues as $id => $value) {
            // Fetch or create a new field value based on customer_id and field_id
            $fieldValue = CustomerCustomFieldValue::firstOrNew([
                'customer_id' => $customerId,
                'field_id' => $id,
            ]);

            // Set the value; you might want to modify this depending on your business logic
            $fieldValue->value = $value ?? '';  // If value is null, set to empty string

            $fieldValue->save();
        }

        return response()->json(['message' => 'Custom fields updated successfully']);
    }






}
