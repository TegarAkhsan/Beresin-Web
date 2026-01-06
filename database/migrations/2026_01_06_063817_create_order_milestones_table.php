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
        Schema::create('order_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('weight');
            $table->string('status')->default('pending');
            // pending (locked), in_progress (unlocked), submitted (review), customer_review, completed, rejected, revision

            $table->string('file_path')->nullable();
            $table->text('joki_notes')->nullable();

            $table->text('admin_feedback')->nullable();
            $table->timestamp('admin_approved_at')->nullable();

            $table->text('customer_feedback')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->integer('sort_order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_milestones');
    }
};
