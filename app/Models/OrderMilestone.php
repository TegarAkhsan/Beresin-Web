<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderMilestone extends Model
{
    protected $fillable = [
        'order_id',
        'name',
        'description',
        'weight',
        'status',
        'file_path',
        'joki_notes',
        'admin_feedback',
        'admin_approved_at',
        'customer_feedback',
        'completed_at',
        'submitted_link',
        'version_label',
        'sort_order',
    ];

    protected $casts = [
        'admin_approved_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
