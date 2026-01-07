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
        // Add Bank Details to Users
        Schema::table('users', function (Blueprint $table) {
            $table->string('bank_name')->nullable()->after('password');
            $table->string('account_number')->nullable()->after('bank_name');
            $table->string('account_holder')->nullable()->after('account_number');
        });

        // Create Payout Requests Table
        Schema::create('payout_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'approved', 'rejected', 'paid'])->default('pending');
            $table->json('bank_details_snapshot')->nullable(); // To store bank details at request time
            $table->text('admin_note')->nullable(); // For rejection reason or transaction ID
            $table->string('proof_file')->nullable(); // Admin upload
            $table->timestamps();
        });

        // Add Payout Request Link to Orders
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('payout_request_id')->nullable()->constrained('payout_requests')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['payout_request_id']);
            $table->dropColumn('payout_request_id');
        });

        Schema::dropIfExists('payout_requests');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bank_name', 'account_number', 'account_holder']);
        });
    }
};
