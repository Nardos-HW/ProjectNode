<?php

namespace Tests\Feature;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\JoinRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProjectModerationTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'email' => 'admin' . uniqid() . '@aau.edu.et',
            'role' => 'admin',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    private function createStudent(): User
    {
        return User::factory()->create([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'role' => 'student',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    public function test_admin_can_remove_project_with_members_and_logged_reason(): void
    {
        $admin = $this->createAdmin();
        $owner = $this->createStudent();
        $applicant = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Commercial Gig Masquerading as Project',
            'description' => 'Valid description for testing admin removal.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Open->value,
        ]);

        JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'Valid application note.',
            'status' => JoinRequestStatus::Accepted->value,
            'decided_at' => now(),
        ]);

        $response = $this->actingAs($admin)->delete(route('admin.projects.destroy', $project), [
            'reason' => 'Off-campus paid commercial work violating AAU academic policy.',
        ]);

        $response->assertSessionHas('success');
        $this->assertSoftDeleted($project);

        $this->assertDatabaseHas('moderation_actions', [
            'admin_id' => $admin->id,
            'action' => 'project_removed',
            'target_type' => 'project',
            'target_id' => $project->id,
            'reason' => 'Off-campus paid commercial work violating AAU academic policy.',
        ]);
    }

    public function test_non_admin_cannot_access_admin_project_endpoints(): void
    {
        $student = $this->createStudent();
        $owner = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Sample Project Listing',
            'description' => 'Valid description text.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Open->value,
        ]);

        $this->actingAs($student)->get(route('admin.projects.index'))->assertForbidden();
        $this->actingAs($student)->delete(route('admin.projects.destroy', $project), [
            'reason' => 'Hacking attempt.',
        ])->assertForbidden();
    }

    public function test_admin_can_restore_soft_deleted_project(): void
    {
        $admin = $this->createAdmin();
        $owner = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Erroneously Removed Project',
            'description' => 'Valid description text.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Open->value,
        ]);

        $project->delete();

        $response = $this->actingAs($admin)->post(route('admin.projects.restore', $project->id), [
            'reason' => 'Project verified as legitimate academic research upon appeal.',
        ]);

        $response->assertSessionHas('success');
        $this->assertNotSoftDeleted($project);

        $this->assertDatabaseHas('moderation_actions', [
            'admin_id' => $admin->id,
            'action' => 'project_restored',
            'target_type' => 'project',
            'target_id' => $project->id,
        ]);
    }
}