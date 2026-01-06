<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MilestoneTemplate extends Model
{
    protected $fillable = ['service_id', 'name', 'description', 'weight', 'sort_order', 'requirements'];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
