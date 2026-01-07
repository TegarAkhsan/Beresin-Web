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

        // UI/UX Design Milestones
        $uiService = Service::where('slug', 'ui-ux-design')->first();
        if ($uiService) {
            $uiTemplates = [
                [
                    'name' => 'Research & Wireframing',
                    'weight' => 20,
                    'sort_order' => 1,
                    'requirements' => 'Requirement gathering, user personas, low-fidelity wireframes.'
                ],
                [
                    'name' => 'Visual Design (UI)',
                    'weight' => 30,
                    'sort_order' => 2,
                    'requirements' => 'High-fidelity design, design system, component creation.'
                ],
                [
                    'name' => 'Prototyping & Flow',
                    'weight' => 30,
                    'sort_order' => 3,
                    'requirements' => 'Interactive prototypes, user flow validation.'
                ],
                [
                    'name' => 'Final Asset Handoff',
                    'weight' => 20,
                    'sort_order' => 4,
                    'requirements' => 'Export assets, design specs, style guide.'
                ]
            ];

            foreach ($uiTemplates as $t) {
                MilestoneTemplate::firstOrCreate(
                    [
                        'service_id' => $uiService->id,
                        'name' => $t['name']
                    ],
                    $t
                );
            }
        }

        // Mobile Development Milestones
        $mobileService = Service::where('slug', 'mobile-development')->first();
        if ($mobileService) {
            $mobileTemplates = [
                [
                    'name' => 'Setup & Architecture',
                    'weight' => 20,
                    'sort_order' => 1,
                    'requirements' => 'Project init, state management setup, database schema.'
                ],
                [
                    'name' => 'Frontend Implementation',
                    'weight' => 30,
                    'sort_order' => 2,
                    'requirements' => 'Slicing UI, responsive layouts, animations.'
                ],
                [
                    'name' => 'Logic & Integration',
                    'weight' => 30,
                    'sort_order' => 3,
                    'requirements' => 'API integration, business logic, offline storage.'
                ],
                [
                    'name' => 'Testing & Final Build',
                    'weight' => 20,
                    'sort_order' => 4,
                    'requirements' => 'Unit/Integration testing, APK/IPA build, store submission prep.'
                ]
            ];

            foreach ($mobileTemplates as $t) {
                MilestoneTemplate::firstOrCreate(
                    [
                        'service_id' => $mobileService->id,
                        'name' => $t['name']
                    ],
                    $t
                );
            }
        }
    }
}
