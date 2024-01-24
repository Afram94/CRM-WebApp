<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;

class CustomerProductController extends Controller
{
    public function addProductToCustomer(Request $request, $customerId)
    {
        $productId = $request->input('product_id');
        $customer = Customer::findOrFail($customerId);

        DB::beginTransaction();

        try {
            $customer->products()->attach($productId);

            $inventory = Inventory::where('product_id', $productId)->first();
            if ($inventory && $inventory->quantity > 0) {
                $inventory->decrement('quantity');
            }

            DB::commit();
            return response()->json(['message' => 'Product added to customer successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to add product to customer.'], 500);
        }
    }
}
