<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::all()->pluck('value', 'key'),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'invoice_name' => 'nullable|string',
            'invoice_address' => 'nullable|string',
            'whatsapp_number' => 'nullable|string',
            'invoice_logo' => 'nullable|image|max:1024', // Max 1MB
            'qris_image' => 'nullable|image|max:1024', // Max 1MB
        ]);

        foreach ($data as $key => $value) {
            if ($key === 'invoice_logo' || $key === 'qris_image') {
                continue; // Handle separately
            }
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        if ($request->hasFile('invoice_logo')) {
            $path = $request->file('invoice_logo')->store('settings', 'public');
            Setting::updateOrCreate(['key' => 'invoice_logo'], ['value' => $path]);
        }

        if ($request->hasFile('qris_image')) {
            $path = $request->file('qris_image')->store('settings', 'public');
            Setting::updateOrCreate(['key' => 'qris_image'], ['value' => $path]);
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
