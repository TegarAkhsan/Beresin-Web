<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Web Dev, UI/UX, etc.
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable(); // For landing page
            $table->timestamps();
        });

        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // Dasar, Menengah, Atas
            $table->decimal('price', 12, 2);
            $table->text('description')->nullable();
            $table->json('features')->nullable(); // List of features
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
        Schema::dropIfExists('services');
    }
};
