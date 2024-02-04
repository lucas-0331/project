<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_name',
        'product_value',
        'product_description',
        'client_id',
        'product_category_id',
    ];
    public function clients()
    {
        return $this->belongsTo(Client::class);
    }

    public function product_categories()
    {
        return $this->belongsTo(ProductCategory::class);
    }
}
