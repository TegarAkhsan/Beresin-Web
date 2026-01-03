<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'price', 'service_id', 'features', 'duration_days', 'joki_fee'];

    protected $casts = [
        'features' => 'array',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
