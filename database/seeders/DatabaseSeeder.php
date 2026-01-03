<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'Admin Beresin',
            'email' => 'admin@beresin.com',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Joki Pro',
            'email' => 'joki@beresin.com',
            'role' => 'joki',
            'password' => bcrypt('password'),
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Customer A',
            'email' => 'customer@beresin.com',
            'role' => 'customer',
            'password' => bcrypt('password'),
        ]);

        $this->call([
            ServiceSeeder::class,
        ]);
    }
}
