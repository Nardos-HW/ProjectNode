<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->string('name_key', 60)->nullable()->after('slug');
            $table->boolean('is_custom')->default(false)->after('name_key');
            $table->foreignId('created_by')->nullable()->after('is_custom')->constrained('users')->nullOnDelete();
        });

        // Backfill name_key for existing skills: lowercase with all whitespace removed
        DB::statement("UPDATE skills SET name_key = LOWER(REGEXP_REPLACE(name, '\s+', '', 'g'))");

        // Verify no collisions exist prior to applying UNIQUE constraint
        $duplicates = DB::table('skills')
            ->select('name_key', DB::raw('count(*) as count'))
            ->groupBy('name_key')
            ->havingRaw('count(*) > 1')
            ->get();

        if ($duplicates->isNotEmpty()) {
            throw new RuntimeException('Duplicate name_key collision detected in existing skills table during backfill.');
        }

        Schema::table('skills', function (Blueprint $table) {
            $table->string('name_key', 60)->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn(['created_by', 'is_custom', 'name_key']);
        });
    }
};
