<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'price', 'sku', 'category_id', 'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function customFieldsValues()
    {
        return $this->hasMany(ProductCustomFieldValue::class, 'product_id', 'id');
    }

    public function customers()
    {
        return $this->belongsToMany(Customer::class);
    }

}
