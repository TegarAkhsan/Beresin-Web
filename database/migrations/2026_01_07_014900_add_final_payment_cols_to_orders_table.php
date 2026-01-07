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
            $table->string('additional_payment_proof')->nullable()->after('additional_revision_fee');
            $table->enum('additional_payment_status', ['unpaid', 'pending', 'paid'])->default('unpaid')->after('additional_payment_proof');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['additional_payment_proof', 'additional_payment_status']);
        });
    }
};
