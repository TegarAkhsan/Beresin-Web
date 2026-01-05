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
            'payment_method' => 'required|in:qris,va',
            // User Profile Fields
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'university' => 'required|string',
            'referral_source' => 'required|string',

            // Order Fields
            'description' => 'nullable|string',
            'deadline' => 'required|date|after:today',
            'notes' => 'nullable|string',
            'external_link' => 'nullable|url',

            // File Uploads
            'reference_file' => 'nullable|file|mimes:pdf|max:5120', // 5MB Max, PDF Only
            'previous_project_file' => 'nullable|file|mimes:pdf|max:5120',
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

        // Calculate Fee (Rush Fee Logic)
        $standardDeadline = now()->addDays($package->duration_days ?? 3)->startOfDay();
        $userDeadline = \Carbon\Carbon::parse($validated['deadline']);

        $amount = $package->price;

        // If user wants it sooner than standard duration (and standard is not in the past)
        if ($userDeadline->lt($standardDeadline) && $standardDeadline->isFuture()) {
            $daysSaved = $userDeadline->diffInDays($standardDeadline);
            // Charge 25k per day saved
            $rushFee = max(0, ceil($daysSaved) * 25000);
            $amount += $rushFee;
        }

        // Add Operational Fee
        $amount += 5000;

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
            'amount' => $amount,
            'description' => $validated['description'] ?? 'No description provided.',
            'deadline' => $validated['deadline'],
            'notes' => $validated['notes'] ?? null,
            'external_link' => $validated['external_link'] ?? null,
            'reference_file' => $referenceFilePath,
            'previous_project_file' => $projectFilePath,
            'payment_method' => $validated['payment_method'],
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
        $settings = \App\Models\Setting::whereIn('key', ['whatsapp_number', 'qris_image'])->pluck('value', 'key');

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'whatsapp_number' => $settings['whatsapp_number'] ?? null,
            'qris_image' => $settings['qris_image'] ?? null,
        ]);
    }

    public function review(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        if (!in_array($order->status, ['review', 'completed', 'revision']) && !$order->result_file) {
            return redirect()->route('orders.show', $order);
        }

        $order->load(['package.service', 'joki', 'user', 'files']);

        return Inertia::render('Orders/Review', [
            'order' => $order,
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
            ]);
            return back()->with('message', 'Payment proof uploaded! Please confirm sending to admin.');
        }

        if ($request->input('action') === 'confirm_payment') {
            $order->update([
                'payment_status' => 'pending_verification',
                'status' => 'waiting_approval',
            ]);
            return back()->with('message', 'Payment confirmed! Waiting for admin verification.');
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

        $settings = \App\Models\Setting::whereIn('key', [
            'whatsapp_number',
            'invoice_name',
            'invoice_address',
            'invoice_logo'
        ])->pluck('value', 'key');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.pdf', compact('order', 'settings'));

        return $pdf->download('Invoice-' . ($order->invoice_number ?? $order->order_number) . '.pdf');
    }

    public function acceptResult(Request $request, Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $order->update([
            'status' => 'completed',
            'completed_at' => now()
        ]);

        \App\Models\Review::create([
            'order_id' => $order->id,
            'user_id' => auth()->id(),
            'rating' => $validated['rating'],
            'comment' => $validated['comment']
        ]);

        return back()->with('message', 'Order completed! Thank you for your feedback.');
    }

    public function requestRevision(Request $request, Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load('package');

        if ($order->revision_count >= $order->package->max_revisions) {
            return back()->with('error', 'Anda telah menggunakan seluruh jatah revisinya.');
        }

        $request->validate([
            'reason' => 'required|string|max:1000',
            'revision_file' => 'nullable|file|max:5120' // 5MB
        ]);

        $path = null;
        if ($request->hasFile('revision_file')) {
            $path = $request->file('revision_file')->store('revisions', 'public');
        }

        $order->update([
            'status' => 'revision',
            'revision_reason' => $request->input('reason'),
            'revision_file' => $path,
            'revision_count' => $order->revision_count + 1
        ]);

        return back()->with('message', 'Revision requested. The Joki has been notified.');
    }
}
