<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class InventoryController extends Controller
{

    public function create()
    {
        return inertia('Inventories/Create');
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $parentUserId = $user->user_id ? $user->user_id : $user->id;
        $search = $request->input('search');

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();

        // Retrieve products only for users who share the same parent_user_id.
        $productsQuery = Inventory::whereIn('user_id', $allUserIdsUnderSameParent);

        if ($search) {
            $productsQuery->where(function($query) use ($search) {
                $query->where('quantity', 'LIKE', '%' . $search . '%')
                ->orWhere('stock_status', 'LIKE', '%' . $search . '%');
            })
                ->orWhereHas('product', function($query) use ($search) {
                    $query->where('name', 'LIKE', '%' . $search . '%');
                });
            
        }

        $inventories = $productsQuery->get()->transform(function ($inventory) {
            return [
                'id' => $inventory->id,
                /* 'product_id' => $inventory->product_id, */
                'product_name' => $inventory->product->name,
                'quantity' => $inventory->quantity,
                'stock_status' => $inventory->stock_status,
                'restock_date' => $inventory->restock_date,
                // Add or transform other fields as needed
            ];
        });

        // If the request is an AJAX call, return the products as JSON.
        if ($request->wantsJson()) {
            return response()->json([
                'auth' => [
                    'inventories' => $inventories
                ]
            ]);
        }

        return inertia('Inventories/Show', [
            'auth' => [
                'inventories' => $inventories
            ]
        ]);
    }

    /**
     * Store a new inventory record.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate the request data
        /* $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
            'stock_status' => 'required|string',
            'restock_date' => 'nullable|date',
        ]); */

        $validator = $request->validate([
            /* 'user_id' => 'required|exists:users,id', */
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
            'stock_status' => 'required|string',
            'restock_date' => 'nullable|date',
        ]);

        // Check if validation fails
        /* if ($validator->fails()) {
            return response()->json($validator->errors(), Response::HTTP_UNPROCESSABLE_ENTITY);
        } */

        $validator['user_id'] = auth()->id(); // Set user_id to the ID of the authenticated user

        // Create the inventory record
        $inventory = Inventory::create($validator);

        // Return the newly created inventory
        return response()->json($inventory, Response::HTTP_CREATED);
    }
}
