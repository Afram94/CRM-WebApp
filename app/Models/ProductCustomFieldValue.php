<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCustomFieldValue extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'field_id', 'value'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function customField()
    {
        return $this->belongsTo(ProductCustomField::class, 'field_id', 'id');
    }
}
