<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\PackageAddon;
use Illuminate\Http\Request;

class AdminPackageAddonController extends Controller
{
    public function store(Request $request, Package $package)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'estimate_days' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $package->addons()->create($validated);

        return back()->with('message', 'Addon created successfully.');
    }

    public function update(Request $request, PackageAddon $addon)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'estimate_days' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $addon->update($validated);

        return back()->with('message', 'Addon updated successfully.');
    }

    public function destroy(PackageAddon $addon)
    {
        $addon->delete();
        return back()->with('message', 'Addon deleted successfully.');
    }
}