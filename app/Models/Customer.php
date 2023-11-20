<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'email',
        'phone_number'
    ];

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function customFieldsValues()
    {
        return $this->hasMany(CustomerCustomFieldValue::class, 'customer_id', 'id');
    }

        public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /* public function customFields()
    {
        return $this->belongsToMany(
            CustomerCustomField::class,
            'customer_custom_field_values', // Pivot table name
            'customer_id',                  // Foreign key on pivot table for Customer model
            'field_id'                      // Foreign key on pivot table for CustomerCustomField model
        )
        ->withPivot('value');               // Get the value from the pivot table if needed
    } */


}
