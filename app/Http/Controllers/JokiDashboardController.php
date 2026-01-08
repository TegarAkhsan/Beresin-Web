<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Auth;

class JokiDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Task Lifecycle Lists
        // Upcoming: Assigned but work not started
        $upcomingTasks = Order::with(['package.service', 'user'])
            ->where('joki_id', $user->id)
            ->whereIn('status', ['in_progress', 'pending_assignment']) // Adjust if status logic changes. Assuming currently 'in_progress' is set on assign.
            ->whereNull('started_at')
            ->orderBy('deadline', 'asc')
            ->get();

        // Active Workspace: Work started
        $activeTasks = Order::with(['package.service', 'user', 'chats', 'files', 'milestones'])
            ->where('joki_id', $user->id)
            ->whereIn('status', ['in_progress', 'review', 'revision', 'finalization'])
            ->whereNotNull('started_at')
            ->latest('started_at')
            ->get();

        // Review Queue
        $reviewTasks = Order::with(['package.service', 'user'])
            ->where('joki_id', $user->id)
            ->where('status', 'review')
            ->get();

        $completedTasks = Order::with(['package.service', 'user', 'review'])
            ->where('joki_id', $user->id)
            ->where('status', 'completed')
            ->latest()
            ->get();

        // 2. Workload & Health Indicator
        $activeCount = $activeTasks->count();
        $workloadStatus = 'Green'; // Safe
        if ($activeCount >= 3 && $activeCount <= 5) {
            $workloadStatus = 'Yellow'; // Busy
        } elseif ($activeCount > 5) {
            $workloadStatus = 'Red'; // Overload
        }

        // 3. Earnings (Using Joki Commission Accessor)
        $completedOrdersCount = $completedTasks->count();

        // Lifetime Earnings (Net Joki Share)
        $totalEarnings = $completedTasks->sum(function ($order) {
            return $order->joki_commission;
        });

        // Available Balance (Completed and NOT requested yet)
        $availableOrders = $completedTasks->whereNull('payout_request_id');
        $availableBalance = $availableOrders->sum(function ($order) {
            return $order->joki_commission;
        });

        // Payout History
        $payoutHistory = \App\Models\PayoutRequest::where('user_id', $user->id)->latest()->get();

        // Pending and Held
        $heldEarnings = $activeTasks->sum(function ($order) {
            // Estimate using current commission logic
            return $order->joki_commission;
        });

        // 4. Performance Metrics
        // Average Rating
        $avgRating = \App\Models\Review::whereHas('order', function ($q) use ($user) {
            $q->where('joki_id', $user->id);
        })->avg('rating') ?? 0;

        // On-time Rate
        $totalCompleted = $completedTasks->count();
        $onTimeCount = $completedTasks->filter(function ($order) {
            return $order->completed_at && $order->completed_at <= $order->deadline;
        })->count();
        $onTimeRate = $totalCompleted > 0 ? round(($onTimeCount / $totalCompleted) * 100) : 0;

        return Inertia::render('Dashboards/JokiDashboard', [
            'upcomingTasks' => $upcomingTasks,
            'activeTasks' => $activeTasks,
            'reviewTasks' => $reviewTasks,
            'completedTasks' => $completedTasks,
            'stats' => [
                'workload_status' => $workloadStatus,
                'total_earnings' => $totalEarnings,
                'held_earnings' => $heldEarnings,
                'avg_rating' => number_format($avgRating, 1),
                'on_time_rate' => $onTimeRate,
                'total_completed' => $totalCompleted
            ],
            'financials' => [
                'available_balance' => $availableBalance,
                'pending_balance' => $heldEarnings,
                'available_orders' => $availableOrders->values(),
                'payout_history' => $payoutHistory,
                'bank_details' => [
                    'bank_name' => $user->bank_name,
                    'account_number' => $user->account_number,
                    'account_holder' => $user->account_holder,
                ]
            ]
        ]);
    }

    public function startTask(Order $order)
    {
        if ($order->joki_id !== Auth::id()) {
            abort(403);
        }

        $order->update([
            'started_at' => now(),
            // Ensure status is in_progress
            'status' => 'in_progress'
        ]);

        return back()->with('message', 'Task started successfully! Timer running.');
    }

    // Upload versioned file
    public function uploadResult(Request $request, Order $order)
    {
        if ($order->joki_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'file' => 'required|file|max:10240', // 10MB
            'version_label' => 'required|string|max:50',
            'note' => 'nullable|string',
            'external_link' => 'nullable|url'
        ]);

        $path = $request->file('file')->store('order_results', 'public');

        $order->files()->create([
            'file_path' => $path,
            'version_label' => $request->version_label,
            'note' => $request->note
        ]);

        // Also update main result_file for backward compatibility and set status to review
        $order->update([
            'result_file' => $path,
            'external_link' => $request->external_link, // Update link
            'status' => 'review'
        ]);

        return back()->with('message', 'File uploaded successfully.');
    }

    // Update External Link
    public function updateLink(Request $request, Order $order)
    {
        if ($order->joki_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'external_link' => 'required|url'
        ]);

        $order->update(['external_link' => $request->external_link]);

        return back()->with('message', 'Link updated successfully.');
    }

    public function uploadMilestone(Request $request, Order $order)
    {
        if ($order->joki_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'milestone_id' => 'required|exists:order_milestones,id',
            'file' => 'required_without:external_link|file|max:10240', // 10MB, required if no link
            'external_link' => 'required_without:file|nullable|url',
            'note' => 'nullable|string',
            'version_label' => 'nullable|string|max:50'
        ]);

        $milestone = $order->milestones()->findOrFail($request->milestone_id);

        // Allow upload if milestone is active OR if the order is in revision mode and milestone is the one under review
        $isRevisionMode = $order->status === 'revision' && in_array($milestone->status, ['submitted', 'customer_review']);

        if ($milestone->status !== 'in_progress' && $milestone->status !== 'revision' && !$isRevisionMode) {
            return back()->withErrors(['milestone_id' => 'This milestone is not active.']);
        }

        $path = $request->hasFile('file') ? $request->file('file')->store('milestone_proofs', 'public') : $milestone->file_path;

        $milestone->update([
            'status' => 'submitted',
            'file_path' => $path,
            'submitted_link' => $request->external_link,
            'version_label' => $request->version_label,
            'joki_notes' => $request->note,
            'submitted_at' => now()
        ]);

        // Create OrderFile for history tracking if file exists
        if ($request->hasFile('file')) {
            \App\Models\OrderFile::create([
                'order_id' => $order->id,
                'file_path' => $path,
                'version_label' => $request->version_label ?? 'V1',
                'note' => $request->note
            ]);
        }

        // Check if there are next milestones
        $nextMilestone = $order->milestones()->where('sort_order', '>', $milestone->sort_order)->exists();

        if (!$nextMilestone) {
            // Only update Order to Review status if this is the Last Milestone
            $order->update(['status' => 'review']);
        } else {
            // Ensure order is in_progress (in case it was in revision)
            $order->update(['status' => 'in_progress']);
        }

        return back()->with('message', 'Milestone submitted for review.');
    }
    public function finalizeOrder(Request $request, Order $order)
    {
        if ($order->joki_id !== Auth::id()) {
            abort(403);
        }

        if ($order->status !== 'finalization') {
            return back()->with('error', 'Order is not in finalization phase.');
        }

        $request->validate([
            'file' => 'nullable|file|max:20480', // 20MB
            'external_link' => 'nullable|url',
            'note' => 'nullable|string'
        ]);

        if (!$request->hasFile('file') && !$request->filled('external_link')) {
            return back()->withErrors(['file' => 'Please provide at least a file or a link.']);
        }

        $path = $order->result_file;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('final_results', 'public');
        }

        $order->update([
            'status' => 'completed',
            'completed_at' => now(),
            'result_file' => $path,
            'external_link' => $request->filled('external_link') ? $request->external_link : $order->external_link,
            // We can store final note in a separate field if needed, or append to description.
            // For now, let's create a final OrderFile to store the note and file history.
        ]);

        // Save to OrderFile for history
        if ($path || $request->filled('external_link')) {
            \App\Models\OrderFile::create([
                'order_id' => $order->id,
                'file_path' => $path,
                'external_link' => $request->external_link,
                'version_label' => 'FINAL',
                'note' => $request->note ?? 'Final Deliverable'
            ]);
        }

        return back()->with('message', 'Order finalized and marked as completed!');
    }

    public function updatePayoutSettings(Request $request)
    {
        $request->validate([
            'bank_name' => 'required|string|max:100',
            'account_number' => 'required|string|max:50',
            'account_holder' => 'required|string|max:100',
        ]);

        $request->user()->update([
            'bank_name' => $request->bank_name,
            'account_number' => $request->account_number,
            'account_holder' => $request->account_holder,
        ]);

        return back()->with('message', 'Payout settings updated successfully.');
    }

    public function requestPayout(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array|min:1',
            'order_ids.*' => 'exists:orders,id',
        ]);

        $user = $request->user();

        // Validate Bank Details
        if (!$user->bank_name || !$user->account_number || !$user->account_holder) {
            return back()->with('error', 'Please complete your payout settings first.');
        }

        // Fetch valid orders
        $orders = \App\Models\Order::whereIn('id', $request->order_ids)
            ->where('joki_id', $user->id)
            ->where('status', 'completed')
            ->whereNull('payout_request_id')
            ->get();

        if ($orders->isEmpty()) {
            return back()->with('error', 'No valid orders selected for payout.');
        }

        $totalAmount = $orders->sum(function ($order) {
            return $order->joki_commission;
        });

        // Create Payout Request
        $payoutRequest = \App\Models\PayoutRequest::create([
            'user_id' => $user->id,
            'amount' => $totalAmount,
            'status' => 'pending',
            'bank_details_snapshot' => [
                'bank_name' => $user->bank_name,
                'account_number' => $user->account_number,
                'account_holder' => $user->account_holder,
            ]
        ]);

        // Link orders
        \App\Models\Order::whereIn('id', $orders->pluck('id'))->update([
            'payout_request_id' => $payoutRequest->id
        ]);

        return back()->with('message', 'Payout request submitted successfully!');
    }
}
