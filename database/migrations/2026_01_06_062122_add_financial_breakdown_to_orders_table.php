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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('base_price', 12, 2)->default(0)->after('amount'); // Price from package + addons
            $table->decimal('rush_fee', 12, 2)->default(0)->after('base_price');
            $table->decimal('platform_fee', 12, 2)->default(0)->after('rush_fee'); // Operational 5000
            $table->decimal('additional_revision_fee', 12, 2)->default(0)->after('platform_fee');

            // Refund fields
            $table->decimal('refund_amount', 12, 2)->nullable()->after('status');
            $table->string('refund_status')->nullable()->after('refund_amount'); // requested, approved, rejected, refunded
            $table->text('cancellation_reason')->nullable()->after('refund_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
};
