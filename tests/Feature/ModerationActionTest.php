<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Models\Department;
use App\Models\ModerationAction;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModerationActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_moderation_action_records_admin_target_and_reason(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin'.uniqid().'@aau.edu.et',
            'role' => 'admin',
        ]);

        $student = User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'role' => 'student',
        ]);

        $log = ModerationAction::create([
            'admin_id' => $admin->id,
            'action' => 'user_suspended',
            'target_type' => 'user',
            'target_id' => $student->id,
            'reason' => 'Violation of academic code of conduct.',
        ]);

        $this->assertDatabaseHas('moderation_actions', [
            'id' => $log->id,
            'admin_id' => $admin->id,
            'action' => 'user_suspended',
            'target_type' => 'user',
            'target_id' => $student->id,
        ]);

        $this->assertEquals($admin->id, $log->admin->id);
        $this->assertEquals($student->id, $log->target->id);
        $this->assertNull($log->updated_at);
    }

    public function test_moderation_action_resolves_soft_deleted_project_target(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin'.uniqid().'@aau.edu.et',
            'role' => 'admin',
        ]);

        $owner = User::factory()->create([
            'email' => 'owner'.uniqid().'@aau.edu.et',
        ]);

        $department = Department::create(['name' => 'Computer Science']);

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Flagged Spam Project',
            'description' => 'A description that violates content guidelines.',
            'category' => ProjectCategory::Personal->value,
            'department_id' => $department->id,
            'slots_total' => 2,
            'hours_per_week' => 5,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(7)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => 'open',
        ]);

        $project->delete(); // Soft delete

        $log = ModerationAction::create([
            'admin_id' => $admin->id,
            'action' => 'project_removed',
            'target_type' => 'project',
            'target_id' => $project->id,
            'reason' => 'Commercial solicitation posted as student project.',
        ]);

        $this->assertNotNull($log->target);
        $this->assertEquals('Flagged Spam Project', $log->target->title);
    }
}
