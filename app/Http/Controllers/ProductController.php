<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    public function create()
    {
        $user = auth()->user();
        $categories = Category::all()->transform(function ($categorie) {
            // Modify the categorie object as needed
            return [
                'id' => $categorie->id,
                'name' => $categorie->name,
                'description' => $categorie->description,
                // Add or transform other fields as needed
            ];
        });

        $products = Product::all()->transform(function ($product) {
            // Modify the product object as needed
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price, // Casting price to float
                'sku' => $product->sku,
                'inventory_count' => $product->inventory_count,
                'category_id' => $product->category_id,
                // Add or transform other fields as needed
            ];
        });
        /* return view('products.create'); // return a view for creating a product */
        return inertia('Products/Create', [
            'auth' => [
                'products' => $products,
                'categories' => $categories,
                'user' => $user,
            ]
        ]);
    }

    public function index()
    {
        $user = auth()->user();
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();

        // Retrieve products only for users who share the same parent_user_id.
        $productsQuery = Product::whereIn('user_id', $allUserIdsUnderSameParent);

        $products = $productsQuery->get()->transform(function ($product) {
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
                'products' => $products,
                'user' => $user
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
            'inventory_count' => 'nullable|integer',
            'category_id' => 'nullable|exists:categories,id', // Ensure the category exists
        ]);

        $validatedData['user_id'] = auth()->id(); // Set user_id to the ID of the authenticated user

        $product = Product::create($validatedData);

        return response()->json($product, 200);
    }

    public function getProducts()
    {
        $user = auth()->user();
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();

        // Retrieve products only for users who share the same parent_user_id.
        $productsQuery = Product::whereIn('user_id', $allUserIdsUnderSameParent);

        $products = $productsQuery->get()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                // Add or transform other fields as needed
            ];
        });

        return response()->json($products, Response::HTTP_OK);
    }
}
