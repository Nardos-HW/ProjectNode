<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('join_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('applicant_id')->constrained('users')->restrictOnDelete();
            $table->string('message', 500);
            $table->string('status', 20)->default('pending');
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();

            $table->unique(['project_id', 'applicant_id']);
            $table->index(['project_id', 'status']);
            $table->index(['applicant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('join_requests');
    }
};