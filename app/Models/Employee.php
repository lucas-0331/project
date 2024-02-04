<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'birthday',
        'gender',
        'address',
        'cpf',
        'pis',
        'position',
        'department',
        'hiring_date',
        'contract_type',
        'bank_agency',
        'bank_account',
        'phone',
        'status',
        'salary',
    ];

    public function clients()
    {
        return $this->belongsTo(Client::class);
    }

    public function users()
    {
        return $this->belongsTo(User::class);
    }
}
