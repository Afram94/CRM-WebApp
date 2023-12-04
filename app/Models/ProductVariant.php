<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'product_id', 'variant_name', 'variant_value'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Relationship with SerialNumbers
    public function serialNumbers()
    {
        return $this->hasMany(SerialNumber::class);
    }

    // Relationship with Inventory
    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }

    // Relationship with OrderItems
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
