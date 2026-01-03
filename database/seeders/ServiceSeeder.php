<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\Package;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // A. Web Development
        $web = Service::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
            'description' => 'Jasa pembuatan website profesional',
            // 'image' => '...' 
        ]);

        $web->packages()->createMany([
            [
                'name' => 'Paket Dasar',
                'price' => 500000, // Example price
                'description' => 'Cocok untuk landing page atau web sederhana',
                'duration_days' => 3,
                'features' => json_encode([
                    'Website statis / dinamis sederhana',
                    'CRUD sederhana',
                    'Auth login/register',
                    'Database MySQL',
                    'UI basic (Bootstrap/Tailwind)',
                    'Max 5 halaman'
                ]),
            ],
            [
                'name' => 'Paket Menengah',
                'price' => 1500000,
                'description' => 'Untuk aplikasi web dengan fitur lengkap',
                'duration_days' => 7,
                'features' => json_encode([
                    'Full CRUD kompleks',
                    'Role & permission',
                    'Dashboard admin',
                    'Integrasi API sederhana',
                    'Upload file & media',
                    'Validasi data',
                    'Max 10 halaman'
                ]),
            ],
            [
                'name' => 'Paket Atas',
                'price' => 3000000,
                'description' => 'Sistem kompleks skala besar',
                'duration_days' => 15,
                'features' => json_encode([
                    'Sistem multi-role & multi-level',
                    'REST API / Backend service',
                    'Payment gateway',
                    'Optimasi performa',
                    'Security hardening',
                    'Deployment & dokumentasi'
                ]),
            ],
            [
                'name' => 'Paket Pelajar',
                'price' => 0,
                'description' => 'Solusi hemat untuk pelajar/mahasiswa',
                'duration_days' => 3,
                'features' => json_encode([
                    'Harga Negotiable',
                    'Fitur Negotiable',
                    'Konsultasi Gratis',
                    'Waktu Pengerjaan Fleksibel'
                ]),
            ],
        ]);

        // B. UI/UX Design
        $design = Service::create([
            'name' => 'UI/UX Design & Research',
            'slug' => 'ui-ux-design',
            'description' => 'Desain antarmuka dan pengalaman pengguna',
        ]);

        $design->packages()->createMany([
            [
                'name' => 'Paket Dasar',
                'price' => 300000,
                'duration_days' => 3,
                'features' => json_encode([
                    'Wireframe low-fidelity',
                    'User flow sederhana',
                    'Desain 1–3 halaman',
                ]),
            ],
            [
                'name' => 'Paket Menengah',
                'price' => 800000,
                'duration_days' => 7,
                'features' => json_encode([
                    'Wireframe mid-fidelity',
                    'Desain UI (Figma)',
                    'Design system dasar',
                    'User flow lengkap',
                ]),
            ],
            [
                'name' => 'Paket Atas',
                'price' => 1500000,
                'duration_days' => 15,
                'features' => json_encode([
                    'UX research (persona & pain point)',
                    'High-fidelity design',
                    'Prototype interaktif',
                    'Usability testing',
                    'Dokumentasi UX',
                ]),
            ],
            [
                'name' => 'Paket Pelajar',
                'price' => 0,
                'description' => 'Solusi hemat untuk pelajar/mahasiswa',
                'duration_days' => 3,
                'features' => json_encode([
                    'Harga Negotiable',
                    'Fitur Negotiable',
                    'Konsultasi Gratis',
                    'Waktu Pengerjaan Fleksibel'
                ]),
            ],
        ]);

        // C. Mobile Development
        $mobile = Service::create([
            'name' => 'Mobile Development',
            'slug' => 'mobile-development',
            'description' => 'Pembuatan aplikasi Android/iOS',
        ]);

        $mobile->packages()->createMany([
            [
                'name' => 'Paket Dasar',
                'price' => 1000000,
                'duration_days' => 3,
                'features' => json_encode([
                    'Aplikasi Flutter sederhana',
                    'CRUD lokal / API',
                    'UI basic',
                ]),
            ],
            [
                'name' => 'Paket Menengah',
                'price' => 2500000,
                'duration_days' => 7,
                'features' => json_encode([
                    'Auth & role user',
                    'API integration',
                    'State management',
                    'Responsive UI',
                ]),
            ],
            [
                'name' => 'Paket Atas',
                'price' => 5000000,
                'duration_days' => 15,
                'features' => json_encode([
                    'Arsitektur scalable',
                    'Push notification',
                    'Payment integration',
                    'Performance optimization',
                    'Build & publish readiness',
                ]),
            ],
            [
                'name' => 'Paket Pelajar',
                'price' => 0,
                'description' => 'Solusi hemat untuk pelajar/mahasiswa',
                'duration_days' => 3,
                'features' => json_encode([
                    'Harga Negotiable',
                    'Fitur Negotiable',
                    'Konsultasi Gratis',
                    'Waktu Pengerjaan Fleksibel'
                ]),
            ],
        ]);
    }
}
