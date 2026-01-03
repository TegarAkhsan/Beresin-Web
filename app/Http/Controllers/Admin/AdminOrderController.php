<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminOrderController extends Controller
{
    public function verify()
    {
        $orders = Order::with(['user', 'package.service'])
            ->where('status', 'pending_payment')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Orders/Verify', [
            'orders' => $orders,
        ]);
    }

    public function approvePayment(Order $order)
    {
        $order->update([
            'status' => 'pending_assignment',
            'payment_status' => 'paid',
            'invoice_number' => 'INV-' . strtoupper(Str::random(10)),
        ]);

        return back()->with('message', 'Payment approved successfully. Order is now ready for assignment.');
    }

    public function assign()
    {
        $search = request('search');

        $pendingOrders = Order::with(['user', 'package.service'])
            ->where('status', 'pending_assignment')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($u) use ($search) {
                            $u->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('package.service', function ($s) use ($search) {
                            $s->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('package', function ($p) use ($search) {
                            $p->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10, ['*'], 'pending_page');

        $assignedOrders = Order::with(['user', 'package.service', 'joki'])
            ->whereIn('status', ['in_progress', 'review'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($u) use ($search) {
                            $u->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('package.service', function ($s) use ($search) {
                            $s->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('package', function ($p) use ($search) {
                            $p->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('joki', function ($j) use ($search) {
                            $j->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10, ['*'], 'assigned_page');

        $jokis = User::where('role', 'joki')
            ->withCount([
                'jobs' => function ($query) {
                    $query->whereIn('status', ['in_progress', 'review']);
                }
            ])
            ->with([
                'jobs' => function ($query) {
                    $query->whereIn('status', ['in_progress', 'review'])
                        ->with(['package.service', 'user'])
                        ->select('id', 'joki_id', 'user_id', 'order_number', 'package_id', 'deadline', 'status', 'description', 'amount');
                }
            ])
            ->get();

        return Inertia::render('Admin/Orders/Assign', [
            'orders' => $pendingOrders,
            'assignedOrders' => $assignedOrders,
            'jokis' => $jokis,
            'filters' => request()->all(['search']),
        ]);
    }

    public function storeAssignment(Request $request, Order $order)
    {
        $request->validate([
            'joki_id' => 'required|exists:users,id',
        ]);

        $order->update([
            'joki_id' => $request->joki_id,
            'status' => 'in_progress',
        ]);

        return back()->with('message', 'Task assigned to Joki successfully.');
    }
}
