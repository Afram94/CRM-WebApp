<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;


class CategoryController extends Controller
{

    private function getUserIdsUnderSameParent()
    {
        $user = auth()->user();
        $parentUserId = $user->user_id ? $user->user_id : $user->id;
    
        return User::where('user_id', $parentUserId)
                   ->orWhere('id', $parentUserId)
                   ->pluck('id')->toArray();
    }

    public function create()
    {
        return inertia('Categories/Create');
    }

    // Path: app/Http/Controllers/CategoryController.php

    public function index(Request $request)
    {
        $user = auth()->user();
        $parentUserId = $user->user_id ? $user->user_id : $user->id;
        $search = $request->input('search');

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();

        // Start the query
        $categoriesQuery = Category::whereIn('user_id', $allUserIdsUnderSameParent);

        // If there's a search term, filter the categories by it.
        if ($search) {
            $categoriesQuery->where(function($query) use ($search) {
                $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('description', 'LIKE', '%' . $search . '%');
                // Add more fields as necessary
            });
        }

        $categories = $categoriesQuery->get()->transform(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                // Add or transform other fields as needed
            ];
        });

        // Determine response type
        if ($request->wantsJson()) {
            return response()->json([
                'auth' => [
                    'categories' => $categories
                ]
            ]);
        }

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

        // Retrieve categories only for users who share the same parent_user_id.
        $categoriesQuery = Category::whereIn('user_id', $allUserIdsUnderSameParent);

        $categories = $categoriesQuery->get()->transform(function ($categorie) {
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

    public function update(Request $request, $id)
    {
        $user = auth()->user();
        // Determine the parent user ID
        $allUserIdsUnderSameParent = $this->getUserIdsUnderSameParent();

        // Find the category and check if it belongs to the authenticated user or to a user under the same parent
        $category = Category::where('id', $id)
                        ->whereIn('user_id', $allUserIdsUnderSameParent)
                        ->firstOrFail();

        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'description' => 'nullable',
        ]);

        // Update the category with validated data
        $category->update($validatedData);

        return response()->json($category, Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        $user = auth()->user();
        // Determine the parent user ID (it's either the user's own ID or their parent's ID)
        $allUserIdsUnderSameParent = $this->getUserIdsUnderSameParent();

        // Check if category exists and belongs to the authenticated user or to the users under the same parent
        if (!$category || !in_array($category->user_id, $allUserIdsUnderSameParent)) {
            return response()->json(['error' => 'Category not found or not authorized'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}
