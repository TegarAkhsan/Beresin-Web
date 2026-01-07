<?php
echo \App\Models\MilestoneTemplate::whereHas('service', function ($q) {
    $q->whereIn('slug', ['ui-ux-design', 'mobile-development']);
})->count();
