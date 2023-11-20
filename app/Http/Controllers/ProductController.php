<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function create()
    {
        /* return view('products.create'); // return a view for creating a product */
        return inertia('Products/Create');
    }

    public function index()
    {
        $products = Product::all()->transform(function ($product) {
            // Modify the product object as needed
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price, // Casting price to float
                'sku' => $product->sku,
                'inventory_count' => $product->inventory_count,
                // Add or transform other fields as needed
            ];
        });

        return inertia('Products/Show', [
            'auth' => [
                'products' => $products
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'description' => 'nullable',
            'price' => 'required|numeric',
            'sku' => 'nullable|unique:products,sku',
            'inventory_count' => 'nullable|integer'
        ]);

        $product = Product::create($validatedData);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }
}
