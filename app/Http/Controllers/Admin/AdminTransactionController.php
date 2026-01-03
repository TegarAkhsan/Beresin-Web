<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'package.service'])
            ->where('payment_status', 'paid');

        // Filter by Date Range
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Filter by Service
        if ($request->filled('service_id')) {
            $query->whereHas('package', function ($q) use ($request) {
                $q->where('service_id', $request->service_id);
            });
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        $services = Service::select('id', 'name')->get();

        return Inertia::render('Admin/Transactions/Index', [
            'orders' => $orders,
            'services' => $services,
            'filters' => $request->only(['start_date', 'end_date', 'service_id']),
        ]);
    }
}
