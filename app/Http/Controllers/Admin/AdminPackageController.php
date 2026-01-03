<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminPackageController extends Controller
{
    public function store(Request $request, Service $service)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|string', // We accept new-line separated string
        ]);

        // Convert features string to JSON array
        $features = $request->features
            ? json_encode(array_filter(array_map('trim', explode("\n", $request->features))))
            : null;

        $service->packages()->create([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'features' => $features,
        ]);

        return back()->with('message', 'Package created successfully.');
    }

    public function update(Request $request, Package $package)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|string',
        ]);

        // Convert features string to JSON array
        $features = $request->features
            ? json_encode(array_filter(array_map('trim', explode("\n", $request->features))))
            : null;

        $package->update([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'features' => $features,
        ]);

        return back()->with('message', 'Package updated successfully.');
    }

    public function destroy(Package $package)
    {
        $package->delete();
        return back()->with('message', 'Package deleted successfully.');
    }
}
