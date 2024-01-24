<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

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
        $validator = $request->validate([
            /* 'user_id' => 'required|exists:users,id', */
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
            'stock_status' => 'required|string',
            'restock_date' => 'nullable|date',
        ]);

        $validator['user_id'] = auth()->id(); // Set user_id to the ID of the authenticated user

        // Create the inventory record
        $inventory = Inventory::create($validator);

        // Return the newly created inventory
        return response()->json($inventory, Response::HTTP_CREATED);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();

        $allUserIdsUnderSameParent = $this->getUserIdsUnderSameParent();

        $inventory = Inventory::where('id', $id)
                            ->whereIn('user_id', $allUserIdsUnderSameParent)
                            ->FirstOrFail();


        $validateData = $request->validate([
            'quantity' => 'required|max:255',
            'stock_Status' => 'sometimes|max:255',
            'min_stock_level' => 'required|max:255',
            'max_stock_level' => 'required|max:255',
            'restock_date' => 'sometimes|max:255',
        ]);

        

        DB::beginTransaction();

        try {
            $inventory->update($validateData);

            DB::commit();
            return response()->json($inventory, Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function getUserIdsUnderSameParent()
    {
        $user = auth()->user();
        $parentUserId = $user->user_id ? $user->user_id : $user->id;
    
        return User::where('user_id', $parentUserId)
                   ->orWhere('id', $parentUserId)
                   ->pluck('id')->toArray();
    }
}
