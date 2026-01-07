<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminWithdrawal extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'notes',
        'bank_details_snapshot'
    ];

    protected $casts = [
        'bank_details_snapshot' => 'array',
    ];
}
