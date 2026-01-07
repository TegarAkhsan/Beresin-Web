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
        // General Stats
        $completedOrders = Order::where('status', 'completed')->get();

        $stats = [
            'total_orders' => Order::count(),
            'active_orders' => Order::whereIn('status', ['pending_payment', 'pending_assignment', 'in_progress', 'review'])->count(),
            // Basic "Revenue" replaced by breakdown
            'revenue_gross' => $completedOrders->sum('amount'),
            'revenue_admin' => $completedOrders->sum('admin_commission'),
            'revenue_ops' => $completedOrders->sum('operational_commission'),

            'total_jokis' => User::where('role', 'joki')->count(),
        ];

        // Payout Requests
        $payoutRequests = \App\Models\PayoutRequest::with('user')->latest()->get();

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
            'payoutRequests' => $payoutRequests
        ]);
    }

    public function processPayout(Request $request, \App\Models\PayoutRequest $payout)
    {
        $request->validate([
            'proof_file' => 'required|file|max:5120', // 5MB
        ]);

        $path = $request->file('proof_file')->store('payout_proofs', 'public');

        $payout->update([
            'status' => 'paid',
            'proof_file' => $path,
            'admin_note' => 'Paid via Admin Dashboard',
        ]);

        return back()->with('message', 'Payout processed and marked as PAID.');
    }

    public function rejectPayout(Request $request, \App\Models\PayoutRequest $payout)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $payout->update([
            'status' => 'rejected',
            'admin_note' => $request->reason,
        ]);

        // Find linked orders and detach them?
        // Logic: If rejected, the orders should become available again for payout request.
        // So we set payout_request_id = null on related orders.
        $payout->orders()->update(['payout_request_id' => null]);

        return back()->with('message', 'Payout request REJECTED. Orders released.');
    }
}
