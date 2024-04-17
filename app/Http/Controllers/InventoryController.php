<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Broadcast;
use App\Events\InventoryCreated;
use App\Events\InventoryUpdated;

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
        $productsQuery = Inventory::whereIn('user_id', $allUserIdsUnderSameParent)->latest();

        if ($search) {
            $productsQuery->where(function($query) use ($search) {
                $query->where('quantity', 'LIKE', '%' . $search . '%')
                ->orWhere('stock_status', 'LIKE', '%' . $search . '%');
            })
                ->orWhereHas('product', function($query) use ($search) {
                    $query->where('name', 'LIKE', '%' . $search . '%');
                });
            
        }

        // Execute the query and paginate results
        $inventories = $productsQuery->paginate(10)->through(function ($inventory) {
            /* dd($inventory->id); */
            return [
                'id' => $inventory->id,
                /* 'product_id' => $inventory->product_id, */
                'user_id' => $inventory->user_id,
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
                    'user' => $user,
                    'inventories' => $inventories
                ]
            ]);
        }

        return inertia('Inventories/Show', [
            'auth' => [
                'user' => $user,
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

        broadcast(new InventoryCreated($inventory))->toOthers(); // use NoteCreated for broadcasting

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
            'stock_status' => 'sometimes|max:255',
            'min_stock_level' => 'required|max:255',
            'max_stock_level' => 'required|max:255',
            'restock_date' => 'sometimes|max:255',
        ]);

        

        DB::beginTransaction();

        
        try {
            $inventory->update($validateData);
            
            DB::commit();
            broadcast(new InventoryUpdated($inventory));
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

    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);

        $user = auth()->user();
        // Determine the parent user ID (it's either the user's own ID or their parent's ID)
        $allUserIdsUnderSameParent = $this->getUserIdsUnderSameParent();

        // Check if product exists and belongs to the authenticated user or to the users under the same parent
        if (!$inventory || !in_array($inventory->user_id, $allUserIdsUnderSameParent)) {
            return response()->json(['error' => 'inventory not found or not authorized'], 403);
        }

        $inventory->delete();

        return response()->json(['message' => 'inventory deleted successfully'], 200);
    }
}
