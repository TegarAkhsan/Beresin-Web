<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $stats = [
            'total_orders' => Order::count(),
            'active_orders' => Order::whereIn('status', ['pending_payment', 'pending_assignment', 'in_progress', 'review'])->count(),
            'revenue' => Order::where('payment_status', 'paid')->sum('amount'),
            'total_jokis' => User::where('role', 'joki')->count(),
        ];

        // Joki Workload (Active orders per joki)
        $joki_workload = User::where('role', 'joki')
            ->withCount([
                'jobs as active_jobs_count' => function ($query) {
                    $query->whereIn('status', ['in_progress', 'review']);
                }
            ])
            ->orderByDesc('active_jobs_count')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'joki_workload' => $joki_workload,
        ]);
    }
}
