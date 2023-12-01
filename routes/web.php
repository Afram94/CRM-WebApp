<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InventoryController;

use App\Http\Controllers\CustomFieldController;
use App\Http\Controllers\CustomerCustomFieldController;
use App\Http\Controllers\CustomerCustomFieldValueController;

use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Display a listing of the customers
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    
    // Show the form for creating a new customer
    Route::get('customers/create', [CustomerController::class, 'create'])->name('customers.create');
    
    // Store a newly created customer in storage
    Route::post('customers', [CustomerController::class, 'store'])->name('customers.store');
    
    // Display the specified customer
    /* Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show'); */

    Route::get('/customer-profile/{id}', [CustomerController::class, 'customerProfile'])->name('customers.customerProfile');
    
    // Show the form for editing the specified customer
    /* Route::get('customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit'); */
    
    // Update the specified customer in storage
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    
    // Remove the specified customer from storage
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');
    
    Route::get('/export-csv', [ExportController::class, 'exportCsv']);
    Route::get('/export-single-customer-csv/{customerId}', [ExportController::class, 'exportSingleCustomerCsv']);

    // Products
    /* Route::resource('products', ProductController::class); */
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::get('/get-products', [ProductController::class, 'getProducts']);

    // Inventory
    Route::get('inventories', [InventoryController::class, 'index']);
    Route::post('inventories', [InventoryController::class, 'store']);
    Route::get('/inventories/create', [InventoryController::class, 'create'])->name('inventories.create');


    // Category
    Route::get('/get-categories', [CategoryController::class, 'getCategories']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/create', [CategoryController::class, 'create']);


    

    Route::get('users', [UserController::class, 'index'])->name('users.index');

    Route::get('/child/under-parent', [UserController::class, 'getAllChildUsersUnderSameParent']);

    Route::get('/current-user', [UserController::class, 'getTheCurrentUser']);

    Route::get('/user-roles', [UserController::class, 'getRoles']);
    Route::get('users/{id}/permissions', [UserController::class, 'getPermissions']);
    Route::post('users/{id}/permissions/{permission}', [UserController::class, 'togglePermission']);


    Route::post('/customers/{customerId}/custom-fields', [CustomerCustomFieldValueController::class, 'store']);
    Route::put('/customers/{customerId}/custom-fields', [CustomerCustomFieldValueController::class, 'update']);
    Route::get('/custom-fields', [CustomerCustomFieldController::class, 'index']);
    Route::post('/add-custom-field', [CustomerCustomFieldController::class, 'store']);

    
    WebSocketsRouter::webSocket('/app', \App\WebSocketHandlers\NoteWebSocketHandler::class);
    
    Route::get('/notes', [NoteController::class, 'index'])->name('notes.index');
    Route::get('notes/{customer_id}', [NoteController::class, 'getNotesByCustomer'])->name('customer.notes');
    Route::get('/notes/create', [NoteController::class, 'create'])->name('notes.create');
    Route::post('/notes', [NoteController::class, 'store'])->name('notes.store');
    Route::put('notes/{note}', [NoteController::class, 'update'])->name('notes.update');
    Route::delete('notes/{note}', [NoteController::class, 'destroy'])->name('notes.destroy');

});



Route::middleware(['auth'])->group(function () {
    Route::get('/generate-invite', [InviteController::class, 'invite'])->name('invite');
    Route::post('/invite', [InviteController::class, 'processInvite'])->name('process.invite');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    /* Route::get('/dashboard', [CustomerController::class, 'index'])->name('dashboard'); */

});

require __DIR__.'/auth.php';
