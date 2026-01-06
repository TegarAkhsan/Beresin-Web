<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageAddon extends Model
{
    protected $fillable = ['package_id', 'name', 'price', 'estimate_days', 'description', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
