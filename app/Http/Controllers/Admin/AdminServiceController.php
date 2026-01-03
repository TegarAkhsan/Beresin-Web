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

    // Methods for store/update would go here (simplified for now to just show Index as requested)
}
