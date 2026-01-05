<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JokiDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // 1. Task Lifecycle Lists
        // Upcoming: Assigned but work not started
        $upcomingTasks = Order::with(['package.service', 'user'])
            ->where('joki_id', $user->id)
            ->whereIn('status', ['in_progress', 'pending_assignment']) // Adjust if status logic changes. Assuming currently 'in_progress' is set on assign.
            ->whereNull('started_at')
            ->orderBy('deadline', 'asc')
            ->get();

        // Active Workspace: Work started
        $activeTasks = Order::with(['package.service', 'user', 'chats', 'files'])
            ->where('joki_id', $user->id)
            ->whereIn('status', ['in_progress', 'review', 'revision'])
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

        // 3. Earnings (Mocked based on order amount for now)
        $completedOrders = $completedTasks;
        $totalEarnings = $completedOrders->sum('amount'); // Assuming 100% for now
        $heldEarnings = $activeTasks->sum('amount');

        // 4. Performance Metrics
        // Average Rating
        $avgRating = \App\Models\Review::whereHas('order', function ($q) use ($user) {
            $q->where('joki_id', $user->id);
        })->avg('rating') ?? 0;

        // On-time Rate
        $totalCompleted = $completedOrders->count();
        $onTimeCount = $completedOrders->filter(function ($order) {
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
            ]
        ]);
    }

    public function startTask(Order $order)
    {
        if ($order->joki_id !== auth()->id()) {
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
        if ($order->joki_id !== auth()->id()) {
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
        if ($order->joki_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'external_link' => 'required|url'
        ]);

        $order->update(['external_link' => $request->external_link]);

        return back()->with('message', 'Link updated successfully.');
    }
}
