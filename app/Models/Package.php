<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PackageAddon;

class Package extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'price', 'service_id', 'features', 'duration_days', 'joki_fee', 'is_negotiable', 'addon_features'];

    protected $casts = [
        'features' => 'array',
        'addon_features' => 'array',
        'is_negotiable' => 'boolean',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function addons()
    {
        return $this->hasMany(PackageAddon::class);
    }
}
