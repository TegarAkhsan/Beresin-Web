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
            $table->timestamp('started_at')->nullable()->after('deadline');
            $table->timestamp('completed_at')->nullable()->after('started_at');
            $table->string('external_link')->nullable()->after('result_file'); // For Figma/GitHub link
        });

        Schema::create('order_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('version_label'); // e.g., "Final v1", "Revision 2"
            $table->timestamps();
        });

        Schema::create('order_chats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained(); // Sender
            $table->text('message');
            $table->boolean('is_resolved')->default(false); // For marking revision points
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_chats');
        Schema::dropIfExists('order_files');

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['started_at', 'completed_at', 'external_link']);
        });
    }
};
