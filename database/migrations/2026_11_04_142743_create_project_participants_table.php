<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->string('role', 20)->default('member');
            $table->foreignId('join_request_id')->nullable()->unique()->constrained('join_requests')->nullOnDelete();
            $table->timestamp('credited_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();

            $table->unique(['project_id', 'user_id']);
            $table->index(['project_id', 'role']);
            $table->index(['user_id', 'confirmed_at']);
        });

        DB::statement("ALTER TABLE project_participants ADD CONSTRAINT project_participants_role_check CHECK (role IN ('owner', 'member'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('project_participants');
    }
};
