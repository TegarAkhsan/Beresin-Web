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
        if (!Schema::hasColumn('packages', 'joki_fee')) {
            Schema::table('packages', function (Blueprint $table) {
                // Defaulting to 0 initially.
                $table->decimal('joki_fee', 15, 2)->default(0)->after('price');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('joki_fee');
        });
    }
};
