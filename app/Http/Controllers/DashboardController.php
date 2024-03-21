<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Determine the parent user ID
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                          ->orWhere('id', $parentUserId)
                                          ->pluck('id')->toArray();

        // Fetch dashboard metrics
        $customerCount = Customer::whereIn('user_id', $allUserIdsUnderSameParent)->count();
        $orderCount = Order::whereIn('user_id', $allUserIdsUnderSameParent)->count();
        $productCount = Product::whereIn('user_id', $allUserIdsUnderSameParent)->count();
        $totalSales = OrderItem::whereIn('order_id', Order::whereIn('user_id', $allUserIdsUnderSameParent)->pluck('id'))
                               ->sum(DB::raw('price * quantity'));
        $outOfStockCount = Inventory::whereIn('user_id', $allUserIdsUnderSameParent)
                                    ->where('stock_status', 'out_of_stock')
                                    ->count();

        // Query for orders by status
        $ordersByStatus = Order::select('status', DB::raw('count(*) as total'))
                               ->whereIn('user_id', $allUserIdsUnderSameParent)
                               ->groupBy('status')
                               ->get()
                               ->keyBy('status')
                               ->map(function ($item) {
                                   return $item->total;
                               });


                               // Add Monthly Sales Data
        $monthlySalesData = Order::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(total) as totalSales')
        ->whereIn('user_id', $allUserIdsUnderSameParent)
        ->groupBy('year', 'month')
        ->orderBy('year', 'asc')
        ->orderBy('month', 'asc')
        ->get();

        // Add Product Counts by Category
        $productCountsByCategory = Product::select('categories.name', DB::raw('COUNT(products.id) as productCount'))
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->whereIn('products.user_id', $allUserIdsUnderSameParent)
            ->groupBy('categories.name')
            ->get();

        // Prepare the dashboard data
        $dashboardData = [
            'customerCount' => $customerCount,
            'orderCount' => $orderCount,
            'productCount' => $productCount,
            'totalSales' => $totalSales,
            'outOfStockCount' => $outOfStockCount,
            'ordersByStatus' => $ordersByStatus,
            'monthlySalesData' => $monthlySalesData,
            'productCountsByCategory' => $productCountsByCategory,
        ];

        // Return the Inertia response
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
                'dashboardData' => $dashboardData,
            ],
        ]);
    }
}
