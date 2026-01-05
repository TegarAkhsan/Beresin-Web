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
            ->whereIn('status', ['pending_payment', 'waiting_approval'])
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
            'assignment_type' => 'required|in:manual,auto',
            'joki_id' => 'required_if:assignment_type,manual|nullable|exists:users,id',
        ]);

        $jokiId = $request->joki_id;
        $jokiName = '';
        $fee = 0;

        if ($request->assignment_type === 'auto') {
            // Find Joki with least active jobs (Working + Review)
            $leastBusyJoki = User::where('role', 'joki')
                ->withCount([
                    'jobs' => function ($query) {
                        $query->whereIn('status', ['in_progress', 'review']);
                    }
                ])
                ->orderBy('jobs_count', 'asc')
                ->inRandomOrder() // Tie-breaker
                ->first();

            if (!$leastBusyJoki) {
                return back()->withErrors(['joki_id' => 'No Joki available for auto-assignment.']);
            }

            $jokiId = $leastBusyJoki->id;
            $jokiName = $leastBusyJoki->name;
            // Fee logic for Auto: Default to Package fee logic or 0
            // Since User requested manual input only for manual assign, we can default Auto to 0
            // Or try to fetch from package if exists (legacy support)
            $fee = $order->package->joki_fee ?? 0;
        } else {
            // Manual Assignment
            $jokiName = User::find($jokiId)->name ?? 'Joki';
            // Use package fee or 0, ignoring manual input as requested
            $fee = $order->package->joki_fee ?? 0;
        }

        $order->update([
            'joki_id' => $jokiId,
            'joki_fee' => $fee,
            'status' => 'in_progress',
        ]);

        return back()->with('message', "Task assigned to {$jokiName} successfully (" . ucfirst($request->assignment_type) . "). Fee: Rp " . number_format($fee, 0, ',', '.'));
    }
    public function batchAutoAssign()
    {
        $pendingOrders = Order::where('status', 'pending_assignment')
            ->with(['package.service'])
            ->get();

        $assignedCount = 0;
        $failedCount = 0;

        foreach ($pendingOrders as $order) {
            $serviceName = $order->package->service->name ?? '';
            $specialization = null;

            // Determine Required Specialization
            if (stripos($serviceName, 'Web') !== false) {
                $specialization = 'web';
            } elseif (stripos($serviceName, 'UI') !== false || stripos($serviceName, 'UX') !== false || stripos($serviceName, 'Design') !== false) {
                $specialization = 'ui/ux';
            } elseif (stripos($serviceName, 'Mobile') !== false || stripos($serviceName, 'Android') !== false || stripos($serviceName, 'iOS') !== false) {
                $specialization = 'mobile';
            }

            \Illuminate\Support\Facades\Log::info("BatchAutoAssign: Order {$order->id}, Service: {$serviceName}, Spec: {$specialization}");

            // Find Candidate
            $query = User::where('role', 'joki');

            if ($specialization) {
                $query->where(function ($q) use ($specialization) {
                    $q->where('specialization', $specialization)
                        ->orWhereNull('specialization');
                });
            }

            // Get Least Busy Joki
            $candidate = $query->withCount([
                'jobs' => function ($q) {
                    $q->whereIn('status', ['in_progress', 'review']);
                }
            ])
                ->orderBy('jobs_count', 'asc')
                ->inRandomOrder()
                ->first();

            if ($candidate) {
                \Illuminate\Support\Facades\Log::info("BatchAutoAssign: Assigned to {$candidate->name} ({$candidate->id})");
                $order->update([
                    'joki_id' => $candidate->id,
                    'joki_fee' => $order->package->joki_fee ?? 0,
                    'status' => 'in_progress'
                ]);
                $assignedCount++;
            } else {
                \Illuminate\Support\Facades\Log::warning("BatchAutoAssign: No candidate found for Order {$order->id}");
                $failedCount++;
            }
        }

        return back()->with('message', "Batch Assign Completed. {$assignedCount} orders assigned. {$failedCount} failed orders (No Suitable Joki).");
    }
}
