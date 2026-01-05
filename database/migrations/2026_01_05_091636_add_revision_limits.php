<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->integer('max_revisions')->default(3)->after('price');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->integer('revision_count')->default(0)->after('revision_file');
        });

        // Seed data
        DB::table('packages')->where('name', 'like', '%Dasar%')->update(['max_revisions' => 4]);
        DB::table('packages')->where('name', 'like', '%Menengah%')->update(['max_revisions' => 7]);
        DB::table('packages')->where('name', 'like', '%Atas%')->update(['max_revisions' => 10]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('revision_count');
        });

        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('max_revisions');
        });
    }
};
