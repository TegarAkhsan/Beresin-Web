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
        Schema::table('admin_withdrawals', function (Blueprint $table) {
            $table->json('bank_details_snapshot')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admin_withdrawals', function (Blueprint $table) {
            $table->dropColumn('bank_details_snapshot');
        });
    }
};
