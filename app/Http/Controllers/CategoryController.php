<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;


class CategoryController extends Controller
{

    public function create()
    {
        return inertia('Categories/Create');
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
        $productsQuery = Category::whereIn('user_id', $allUserIdsUnderSameParent);

        $categories = $productsQuery->get()->transform(function ($categorie) {
            return [
                'id' => $categorie->id,
                'name' => $categorie->name,
                'description' => $categorie->description,
                // Add or transform other fields as needed
            ];
        });

        /* $categories = Category::all()->transform(function ($categorie) {
            // Modify the categorie object as needed
            return [
                'id' => $categorie->id,
                'name' => $categorie->name,
                'description' => $categorie->description,
                // Add or transform other fields as needed
            ];
        }); */

        return inertia('Categories/Show', [
            'auth' => [
                'categories' => $categories
            ]
        ]);
    }

    public function getCategories()
    {
        $user = auth()->user();
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();

        // Retrieve products only for users who share the same parent_user_id.
        $productsQuery = Category::whereIn('user_id', $allUserIdsUnderSameParent);

        $categories = $productsQuery->get()->transform(function ($categorie) {
            return [
                'id' => $categorie->id,
                'name' => $categorie->name,
                'description' => $categorie->description,
                // Add or transform other fields as needed
            ];
        });

        return response()->json($categories, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'description' => 'nullable'
        ]);

        $validatedData['user_id'] = auth()->id();

        $category = Category::create($validatedData);
        return response()->json($category, 201);
    }
}
