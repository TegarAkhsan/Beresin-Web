<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_milestones', function (Blueprint $table) {
            $table->string('version_label')->nullable()->after('status');
            $table->text('submitted_link')->nullable()->after('file_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_milestones', function (Blueprint $table) {
            $table->dropColumn(['version_label', 'submitted_link']);
        });
    }
};
