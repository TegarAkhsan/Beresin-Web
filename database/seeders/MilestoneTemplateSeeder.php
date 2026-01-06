<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\MilestoneTemplate;

class MilestoneTemplateSeeder extends Seeder
{
    public function run()
    {
        // Find Web Development Service
        $service = Service::where('slug', 'web-development')->first();

        if ($service) {
            $templates = [
                [
                    'name' => 'Planning & Setup',
                    'weight' => 20,
                    'sort_order' => 1,
                    'requirements' => 'Setup repo, install framework, database design diagram.'
                ],
                [
                    'name' => 'Core Development',
                    'weight' => 30,
                    'sort_order' => 2,
                    'requirements' => 'Authentication logic, Database migration, CRUD foundation.'
                ],
                [
                    'name' => 'UI & Integration',
                    'weight' => 30,
                    'sort_order' => 3,
                    'requirements' => 'Frontend Views, API Integration, Styling.'
                ],
                [
                    'name' => 'Finalisasi & Testing',
                    'weight' => 20,
                    'sort_order' => 4,
                    'requirements' => 'Bug fixing, Deployment (if needed), Final Report.'
                ]
            ];

            foreach ($templates as $t) {
                MilestoneTemplate::firstOrCreate(
                    [
                        'service_id' => $service->id,
                        'name' => $t['name']
                    ],
                    $t
                );
            }
        }
    }
}
