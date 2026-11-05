<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->restrictOnDelete();
            $table->string('title', 120);
            $table->text('description');
            $table->string('category', 30);
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->unsignedSmallInteger('slots_total');
            $table->unsignedSmallInteger('hours_per_week')->default(10);
            $table->unsignedSmallInteger('duration_weeks')->default(4);
            $table->date('application_deadline');
            $table->string('telegram_contact', 32);
            $table->string('status', 20)->default('open');
            $table->timestamp('completed_at')->nullable();
            $table->text('outcome_summary')->nullable();
            $table->string('outcome_url', 255)->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['status', 'application_deadline']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
