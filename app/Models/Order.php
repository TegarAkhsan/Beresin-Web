<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Allow invoice_number to be filled if guarded isn't covering it effectively or if we switch logic
    // actually guarded id is fine, but let's be safe if we use create
    protected $fillable = [
        'order_number',
        'user_id',
        'package_id',
        'joki_id',
        'amount',
        'status',
        'payment_status',
        'payment_proof',
        'payment_method',
        'result_file',
        'description',
        'deadline',
        'notes',
        'invoice_number',
        'started_at',
        'completed_at',
        'external_link',
        'reference_file',
        'previous_project_file',
        'joki_fee',
        'revision_reason',
        'revision_count',
        'is_negotiation',
        'student_card',
        'proposed_price',
        'negotiation_deadline',
        'selected_features',
        'revision_file',
        'base_price',
        'rush_fee',
        'platform_fee',
        'additional_revision_fee',
        'refund_amount',
        'refund_status',
        'cancellation_reason'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'deadline' => 'date',
        'negotiation_deadline' => 'date',
        'is_negotiation' => 'boolean',
        'selected_features' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function joki()
    {
        return $this->belongsTo(User::class, 'joki_id');
    }

    public function milestones()
    {
        return $this->hasMany(OrderMilestone::class)->orderBy('sort_order');
    }

    public function reviews()
    {
        return $this->hasOne(Review::class);
    }

    // Alias for singular access
    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function files()
    {
        return $this->hasMany(OrderFile::class);
    }

    public function chats()
    {
        return $this->hasMany(OrderChat::class);
    }
}
