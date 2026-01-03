<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $orders = [];

        if ($user->role === 'customer') {
            $orders = Order::with(['package.service', 'joki', 'review'])
                ->where('user_id', $user->id)
                ->latest()
                ->get(); // Keeping get() for now to avoid breaking UI that expects array
        } elseif ($user->role === 'joki') {
            return app(JokiDashboardController::class)->index();
        } elseif ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Dashboard', [
            'orders' => $orders,
            'stats' => [
                'total_orders' => $orders->where('status', '!=', 'pending_payment')->count(),
                'active_orders' => $orders->whereIn('status', ['pending', 'paid', 'in_progress', 'revision'])->count(),
                'completed_orders' => $orders->where('status', 'completed')->count(),
                'pending_payment_orders' => $orders->where('status', 'pending_payment')->count(),
            ]
        ]);
    }
}
