<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductCustomField;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{

    private function getUserIdsUnderSameParent()
    {
        $user = auth()->user();
        $parentUserId = $user->user_id ? $user->user_id : $user->id;
    
        return User::where('user_id', $parentUserId)
                   ->orWhere('id', $parentUserId)
                   ->pluck('id')->toArray();
    }

    private function prepareValidationRules(array $customFields)
    {
        $validationRules = [];
        foreach ($customFields as $fieldId => $value) {
            $fieldDefinition = ProductCustomField::findOrFail($fieldId); // Use ProductCustomField model

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
        return $validationRules;
    }


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

    /* public function index(Request $request)
    {
        $user = auth()->user();
        $allUserIdsUnderSameParent = $this->getUserIdsUnderSameParent();
        $search = $request->input('search');

        // Retrieve products only for users who share the same parent_user_id.
        $productsQuery = Product::with('category') // Ensure the category relation is loaded
                            ->whereIn('user_id', $allUserIdsUnderSameParent);

        // Apply search filter if search term is present
        if ($search) {
            $productsQuery->where(function($query) use ($search) {
                $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('description', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('category', function($query) use ($search) {
                        $query->where('name', 'LIKE', '%' . $search . '%');
                    });
            });
        }

        $products = $productsQuery->get()->map(function ($product) {
            // Modify the product object as needed
            return [
                'id' => $product->id,
                'category_id' => $product->category->id,
                'category_name' => $product->category->name,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price, // Casting price to float
                'sku' => $product->sku,
                'inventory_count' => $product->inventory_count,
                // Add or transform other fields as needed
            ];
        });

        if ($request->wantsJson()) {
            return response()->json([
                'auth' => [
                    'products' => $products,
                    'user' => $user
                ]
            ]);
        }

        return inertia('Products/Show', [
            'auth' => [
                'products' => $products,
                'user' => $user
            ]
        ]);
    } */

    public function index(Request $request)
    {
        $user = auth()->user();
        $allUserIdsUnderSameParent = $this->getUserIdsUnderSameParent();
        $search = $request->input('search');
    
        // Retrieve products only for users who share the same parent_user_id.
        $productsQuery = Product::with(['category', 'customFieldsValues', 'customFieldsValues.customField'])
                                ->whereIn('user_id', $allUserIdsUnderSameParent);
    
        // Apply search filter if search term is present
        if ($search) {
            $productsQuery->where(function($query) use ($search) {
                $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('description', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('category', function($query) use ($search) {
                        $query->where('name', 'LIKE', '%' . $search . '%');
                    });
            });
        }
    
        // Fetch all products
        $products = $productsQuery->get();
    
        // If the request is an AJAX call, return the products as JSON.
        if ($request->wantsJson()) {
            return response()->json([
                'auth' => [
                    'user' => $user,
                    'products' => $products
                ]
            ]);
        }
    
        // If it's a regular page request, return the Inertia view.
        return inertia('Products/Show', [
            'auth' => [
                'user' => $user,
                'products' => $products
            ]
        ]);
    }
    



    /* public function store(Request $request)
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
    } */

    public function store(Request $request)
{
    // Validate fixed fields
    $request->validate([
        'name' => 'required|max:255',
        'description' => 'nullable',
        'price' => 'required|numeric',
        'sku' => 'nullable|unique:products,sku',
        'inventory_count' => 'nullable|integer',
        'category_id' => 'nullable|exists:categories,id', // Ensure the category exists
        // 'custom_fields' => 'sometimes|array' // Custom fields are optional
    ]);

    // Start the transaction
    DB::beginTransaction();

    try {
        // Create the product
        $validatedData = $request->only(['name', 'description', 'price', 'sku', 'inventory_count', 'category_id']);
        $validatedData['user_id'] = auth()->id(); // Set user_id to the ID of the authenticated user
        $product = Product::create($validatedData);

        // Process custom fields
        if ($request->has('custom_fields')) {
            $customFields = $request->input('custom_fields');
            // Assume prepareValidationRules() method exists and is similar to that in CustomerController
            $validationRules = $this->prepareValidationRules($customFields);
            $request->validate($validationRules);

            foreach ($customFields as $fieldId => $value) {
                $fieldDefinition = ProductCustomField::findOrFail($fieldId);
                $product->customFieldsValues()->create([
                    'field_id' => $fieldId,
                    'value' => $value,
                ]);
            }
        }

        // Commit the transaction
        DB::commit();

        return response()->json($product, 200);

    } catch (\Exception $e) {
        // If there is an exception, rollback the transaction
        DB::rollBack();
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    public function update(Request $request, $id)
    {
        $user = auth()->user();
        // Determine the parent user ID
        $allUserIdsUnderSameParent = $this->getUserIdsUnderSameParent();

        // Find the product and check if it belongs to the authenticated user or to a user under the same parent
        $product = Product::where('id', $id)
                        ->whereIn('user_id', $allUserIdsUnderSameParent)
                        ->firstOrFail();

        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'description' => 'nullable',
            'price' => 'required|numeric',
            'sku' => 'nullable|unique:products,sku,' . $product->id,
            'inventory_count' => 'nullable|integer',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        // Update the product with validated data
        $product->update($validatedData);

        return response()->json($product, Response::HTTP_OK);
    }


    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        $user = auth()->user();
        // Determine the parent user ID (it's either the user's own ID or their parent's ID)
        $allUserIdsUnderSameParent = $this->getUserIdsUnderSameParent();

        // Check if product exists and belongs to the authenticated user or to the users under the same parent
        if (!$product || !in_array($product->user_id, $allUserIdsUnderSameParent)) {
            return response()->json(['error' => 'Product not found or not authorized'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }


    public function getProducts()
    {
        $user = auth()->user();
        $allUserIdsUnderSameParent = $this->getUserIdsUnderSameParent();

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
