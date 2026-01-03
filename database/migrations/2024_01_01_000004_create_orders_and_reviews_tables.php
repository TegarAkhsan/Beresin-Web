<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained('users'); // Customer
            $table->foreignId('package_id')->constrained('packages');
            $table->foreignId('joki_id')->nullable()->constrained('users'); // Assigned Joki

            $table->text('description'); // Requirement details
            $table->text('notes')->nullable();
            $table->date('deadline');
            $table->decimal('amount', 12, 2);

            $table->string('status')->default('pending_payment');
            // pending_payment, pending_verification, pending_assignment, in_progress, review, completed, cancelled

            $table->string('payment_proof')->nullable();
            $table->string('payment_status')->default('pending'); // pending, paid, failed

            $table->string('result_file')->nullable(); // Uploaded mainly by Joki

            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained(); // Reviewer (Customer)
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('orders');
    }
};
