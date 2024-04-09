<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'user_id', 'product_id', 'quantity', 'stock_status', 'min_stock_level', 'max_stock_level', 'restock_date'];

    protected $table = 'inventories';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}



/* <?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    // Specify your table name if it's not the plural form of your model
    protected $table = 'inventories';

    // Make sure to only include fields that you want to be mass-assignable
    protected $fillable = [
        'id',
        'user_id', 
        'product_id', 
        'quantity', 
        'stock_status', 
        'min_stock_level', 
        'max_stock_level', 
        'restock_date',
    ];

    // Cast attributes to native types
    protected $casts = [
        'restock_date' => 'date', // Ensures that restock_date is treated as a Carbon instance
        'min_stock_level' => 'integer',
        'max_stock_level' => 'integer',
        'quantity' => 'integer',
    ];

    // Define relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Assuming ProductVariant is another model related through a 'product_variant_id' foreign key
    // Ensure there is a 'product_variant_id' column in your inventories table if you're using this relationship
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
 */