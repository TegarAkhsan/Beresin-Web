<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class NegotiationSeeder extends Seeder
{
    public function run(): void
    {
        // Find Paket Pelajar packages (assuming strictly by name pattern or logic)
        // Usually "Paket Pelajar" exists for Web Dev service.

        $studentPackages = Package::where('name', 'like', '%Pelajar%')
            ->orWhere('name', 'like', '%Student%')
            ->get();

        foreach ($studentPackages as $pkg) {
            $pkg->update([
                'is_negotiable' => true,
                'addon_features' => [
                    ['name' => 'Landing Page (Simple)', 'price' => 50000],
                    ['name' => 'Landing Page (Complex)', 'price' => 100000],
                    ['name' => 'Authentication (Login/Register)', 'price' => 75000],
                    ['name' => 'Dashboard Admin', 'price' => 150000],
                    ['name' => 'Payment Gateway Integration', 'price' => 200000],
                    ['name' => 'Crude Operations (CRUD)', 'price' => 50000],
                    ['name' => 'Responsive Design', 'price' => 25000],
                ]
            ]);
        }
    }
}
