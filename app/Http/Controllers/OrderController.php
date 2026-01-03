<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function create(Request $request)
    {
        $packages = Package::with('service')->get();
        $selectedPackageId = $request->query('package_id');

        return Inertia::render('Orders/Create', [
            'packages' => $packages,
            'selectedPackageId' => $selectedPackageId,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            // User Profile Fields
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'university' => 'required|string',
            'referral_source' => 'required|string',

            // Order Fields
            'description' => 'nullable|string', // Made optional/nullable based on "Catatan Pesanan"
            'deadline' => 'required|date|after:today',
            'notes' => 'nullable|string',

            // File Uploads
            'reference_file' => 'nullable|file|max:10240', // 10MB Max
            'previous_project_file' => 'nullable|file|max:10240',
        ]);

        $user = auth()->user();

        // Update User Profile
        $user->update([
            'name' => $validated['name'],
            'gender' => $validated['gender'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'university' => $validated['university'],
            'referral_source' => $validated['referral_source'],
        ]);

        $package = Package::find($validated['package_id']);

        // Handle File Uploads
        $referenceFilePath = null;
        if ($request->hasFile('reference_file')) {
            $referenceFilePath = $request->file('reference_file')->store('order_refs', 'public');
        }

        $projectFilePath = null;
        if ($request->hasFile('previous_project_file')) {
            $projectFilePath = $request->file('previous_project_file')->store('order_projects', 'public');
        }

        $order = Order::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),
            'user_id' => $user->id,
            'package_id' => $package->id,
            'amount' => $package->price,
            'description' => $validated['description'] ?? 'No description provided.',
            'deadline' => $validated['deadline'],
            'notes' => $validated['notes'] ?? null,
            'reference_file' => $referenceFilePath,
            'previous_project_file' => $projectFilePath,
            'status' => 'pending_payment',
        ]);

        // Return the created order to the frontend
        return redirect()->route('orders.show', $order)->with('message', 'Order placed successfully! Please complete payment.');
    }

    public function show(Order $order)
    {
        if ($order->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        $order->load(['package.service', 'joki', 'user']);
        $whatsapp_number = \App\Models\Setting::where('key', 'whatsapp_number')->value('value');

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'whatsapp_number' => $whatsapp_number,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        if ($order->user_id !== auth()->id() && auth()->user()->role !== 'admin' && auth()->user()->role !== 'joki') {
            abort(403);
        }

        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payments', 'public');
            $order->update([
                'payment_proof' => $path,
                'payment_status' => 'paid', // Auto set to paid for mock, or pending verification
                'status' => 'pending_assignment', // Moves to next step
            ]);
            return back()->with('message', 'Payment proof uploaded!');
        }

        if ($request->hasFile('result_file')) {
            $path = $request->file('result_file')->store('results', 'public');
            $order->update([
                'result_file' => $path,
                'status' => 'completed', // Or review
            ]);
            return back()->with('message', 'Result uploaded!');
        }

        // Status update for Joki?
        if ($request->has('status') && auth()->user()->role === 'joki') {
            $order->update(['status' => $request->input('status')]);
            return back()->with('message', 'Status updated.');
        }

        return back();
    }

    public function cancel(Order $order)
    {
        if ($order->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        if ($order->status !== 'pending_payment') {
            return back()->with('error', 'Order cannot be cancelled.');
        }

        $order->update(['status' => 'cancelled']);

        return back()->with('message', 'Order cancelled successfully.');
    }

    public function downloadInvoice(Order $order)
    {
        if ($order->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        $order->load(['user', 'package.service']);
        $whatsapp = \App\Models\Setting::where('key', 'whatsapp_number')->value('value');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.pdf', compact('order', 'whatsapp'));

        return $pdf->download('Invoice-' . ($order->invoice_number ?? $order->order_number) . '.pdf');
    }
}
