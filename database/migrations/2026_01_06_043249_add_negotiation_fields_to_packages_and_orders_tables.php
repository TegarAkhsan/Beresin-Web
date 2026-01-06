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
        Schema::table('packages', function (Blueprint $table) {
            $table->boolean('is_negotiable')->default(false);
            $table->json('addon_features')->nullable(); // [{"name": "Landing Page", "price": 50000}, ...]
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('is_negotiation')->default(false);
            $table->string('student_card')->nullable(); // Path to file
            $table->decimal('proposed_price', 12, 2)->nullable();
            $table->date('negotiation_deadline')->nullable();
            $table->json('selected_features')->nullable(); // ["Landing Page", "Auth"]
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['is_negotiable', 'addon_features']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'is_negotiation',
                'student_card',
                'proposed_price',
                'negotiation_deadline',
                'selected_features'
            ]);
        });
    }
};
