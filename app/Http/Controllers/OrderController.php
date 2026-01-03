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
            'email' => 'required|email', // Check match?
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'university' => 'required|string',
            'referral_source' => 'required|string',
            // Order Fields - description removed from form, assuming generated or fixed? 
            // Wait, Services.jsx DOES NOT sending description/deadline/notes in the new form!
            // I need to adjust validation. The standard form only asks for profile info.
            // Let's assume description is auto-filled or optional for now?
            // Actually, looking at Services.jsx, it ONLY sends profile data + package_id.
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

        $order = Order::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),
            'user_id' => $user->id,
            'package_id' => $package->id,
            'amount' => $package->price,
            'description' => 'New Order for ' . $package->name, // Default description
            'deadline' => now()->addDays(7), // Default deadline
            'status' => 'pending_payment',
        ]);

        // Return the created order to the frontend
        return back()->with([
            'message' => 'Order created successfully!',
            'order' => $order
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load(['package.service', 'joki', 'user']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $this->authorize('update', $order);

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
        $this->authorize('update', $order);

        if ($order->status !== 'pending_payment') {
            return back()->with('error', 'Order cannot be cancelled.');
        }

        $order->update(['status' => 'cancelled']);

        return back()->with('message', 'Order cancelled successfully.');
    }

    public function downloadInvoice(Order $order)
    {
        $this->authorize('view', $order);

        $order->load(['user', 'package.service']);
        $whatsapp = \App\Models\Setting::where('key', 'whatsapp_number')->value('value');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.pdf', compact('order', 'whatsapp'));

        return $pdf->download('Invoice-' . ($order->invoice_number ?? $order->order_number) . '.pdf');
    }
}
