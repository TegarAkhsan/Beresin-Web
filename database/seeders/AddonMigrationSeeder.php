<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\PackageAddon;
use Illuminate\Database\Seeder;

class AddonMigrationSeeder extends Seeder
{
    public function run(): void
    {
        $packages = Package::whereNotNull('addon_features')
            ->where('is_negotiable', true)
            ->get();

        foreach ($packages as $package) {
            $jsonData = $package->addon_features; // Encoded or array depending on cast

            // If it's already an array due to cast, use it directly
            if (is_string($jsonData)) {
                $jsonData = json_decode($jsonData, true);
            }

            if (is_array($jsonData)) {
                foreach ($jsonData as $addon) {
                    PackageAddon::create([
                        'package_id' => $package->id,
                        'name' => $addon['name'],
                        'price' => $addon['price'],
                        'is_active' => true,
                    ]);
                }
            }
        }
    }
}
