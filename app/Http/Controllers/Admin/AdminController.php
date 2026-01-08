<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Auth;

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
            'revenue_ops' => $completedOrders->sum('operational_commission'),

            'total_jokis' => User::where('role', 'joki')->count(),
        ];

        // Payout Requests
        $payoutRequests = \App\Models\PayoutRequest::with(['user', 'orders.package'])->latest()->get();

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

    public function earnings()
    {
        // 1. Fetch Earnings (Completed Orders)
        $earnings = Order::where('status', 'completed')
            ->latest()
            ->get();

        $totalEarnings = $earnings->sum('admin_commission');

        // 2. Fetch Withdrawals
        $withdrawals = \App\Models\AdminWithdrawal::latest()->get();
        $totalWithdrawn = $withdrawals->sum('amount');

        // 3. Calculate Available Balance
        $availableBalance = $totalEarnings - $totalWithdrawn;

        // 4. Transform Earnings History
        $earningHistory = $earnings->map(function ($order) {
            return [
                'id' => 'earn_' . $order->id,
                'raw_date' => $order->updated_at,
                'date' => $order->updated_at->format('d M Y'),
                'order_number' => $order->order_number,
                'package' => $order->package->name ?? 'N/A', // Assuming package relation exists
                'source' => '20% Commission from Base Price',
                'amount' => $order->admin_commission,
                'type' => 'income'
            ];
        });

        // 5. Transform Withdrawal History
        $withdrawalHistory = $withdrawals->map(function ($wd) {
            return [
                'id' => 'wd_' . $wd->id,
                'raw_date' => $wd->created_at,
                'date' => $wd->created_at->format('d M Y'),
                'order_number' => 'WD-' . str_pad($wd->id, 5, '0', STR_PAD_LEFT),
                'package' => 'Withdrawal',
                'source' => ($wd->notes ?? 'Withdrawal') . (
                    isset($wd->bank_details_snapshot['bank_name'])
                    ? ' - to ' . $wd->bank_details_snapshot['bank_name'] . ' (' . $wd->bank_details_snapshot['account_number'] . ')'
                    : ''
                ),
                'amount' => -$wd->amount, // Negative for display
                'type' => 'expense'
            ];
        });

        // 6. Merge and Sort
        $history = $earningHistory->concat($withdrawalHistory)->sortByDesc('raw_date')->values();

        return Inertia::render('Admin/Earnings', [
            'totalEarnings' => $totalEarnings,
            'totalWithdrawn' => $totalWithdrawn,
            'availableBalance' => $availableBalance,
            'history' => $history,
            'bank_details' => [
                'bank_name' => Auth::user()->bank_name,
                'account_number' => Auth::user()->account_number,
                'account_holder' => Auth::user()->account_holder,
            ]
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
    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'notes' => 'nullable|string|max:255'
        ]);

        // Calculate available balance to prevent overdraw
        $totalEarnings = Order::where('status', 'completed')->get()->sum('admin_commission');
        $totalWithdrawn = \App\Models\AdminWithdrawal::sum('amount');
        $availableBalance = $totalEarnings - $totalWithdrawn;

        if ($request->amount > $availableBalance) {
            return back()->withErrors(['amount' => 'Insufficient funds. Available: Rp ' . number_format($availableBalance, 0, ',', '.')]);
        }

        $user = Auth::user();
        $bankDetailsSnapshot = [
            'bank_name' => $user->bank_name,
            'account_number' => $user->account_number,
            'account_holder' => $user->account_holder,
        ];

        \App\Models\AdminWithdrawal::create([
            'amount' => $request->amount,
            'notes' => $request->notes,
            'bank_details_snapshot' => $bankDetailsSnapshot,
        ]);

        return back()->with('success', 'Withdrawal recorded successfully.');
    }

    public function updatePayoutSettings(Request $request)
    {
        $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'account_holder' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $user->update([
            'bank_name' => $request->bank_name,
            'account_number' => $request->account_number,
            'account_holder' => $request->account_holder,
        ]);

        return back()->with('success', 'Bank details updated successfully.');
    }
}
