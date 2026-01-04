<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run()
    {
        $settings = [
            ['key' => 'whatsapp_number', 'value' => '6281234567890'],
            ['key' => 'instagram_url', 'value' => 'https://instagram.com/beresin__id'],
            ['key' => 'email_contact', 'value' => 'admin@beresin.com'],
            ['key' => 'footer_description', 'value' => 'Platform jasa digital terpercaya untuk kebutuhan Web Development, UI/UX Design, dan Mobile App. Solusi cepat, aman, dan berkualitas.'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }
    }
}
