<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id' => auth()->id(),
                'customer_id' => $request->customer_id,
                'total' => 0, // Will be updated after calculating total
                'status' => 'pending',
            ]);

            $total = 0;
            foreach ($request->products as $productData) {
                $product = Product::find($productData['id']);
                if (!$product) {
                    continue; // Skip if product not found
                }
                $price = $product->price; // Assuming price is a field in your products table

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $productData['quantity'],
                    'price' => $price,
                ]);

                $total += $price * $productData['quantity'];

                // Decrement inventory
                $inventory = Inventory::where('product_id', $product->id)->first();
                if ($inventory && $inventory->quantity >= $productData['quantity']) {
                    $inventory->decrement('quantity', $productData['quantity']);
                } else {
                    // Handle case where inventory is insufficient
                    throw new \Exception("Insufficient inventory for product ID: {$product->id}");
                }
            }

            $order->update(['total' => $total]);

            DB::commit();
            return response()->json(['message' => 'Order created successfully', 'order' => $order->load('orderItems')]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create order. ' . $e->getMessage()], 500);
        }
    }
}

