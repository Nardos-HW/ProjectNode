<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('join_request_id')->unique()->constrained('join_requests')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('owner_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('member_id')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index('owner_id');
            $table->index('member_id');
            $table->index('project_id');
        });

        DB::statement('ALTER TABLE conversations ADD CONSTRAINT check_conversations_owner_not_member CHECK (owner_id <> member_id)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
