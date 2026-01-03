<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('packages')->get();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);

        Service::create($validated);

        return back()->with('message', 'Service created successfully.');
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);

        $service->update($validated);

        return back()->with('message', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return back()->with('message', 'Service deleted successfully.');
    }
}
