<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerCustomField extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function values()
    {
        return $this->hasMany(CustomerCustomFieldValue::class, 'field_id', 'id');
    }

    /* public function customers()
    {
        return $this->hasManyThrough(
            Customer::class,               // Final destination model (related)
            CustomerCustomFieldValue::class, // Intermediate model (through)
            'field_id',                    // Foreign key on intermediate model
            'id',                         // Local primary key
            'id',                         // Local key
            'customer_id'                 // Foreign key on final destination model
        );
    } */


    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'customer_custom_fields';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'field_name',
        'field_type',
        'is_required',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
    ];
}
