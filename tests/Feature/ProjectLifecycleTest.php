<?php

namespace Tests\Feature;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\Department;
use App\Models\JoinRequest;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private function createVerifiedStudent(): User
    {
        return User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
            'telegram_handle' => 'tg_handle',
        ]);
    }

    private function createProject(User $owner, array $attributes = []): Project
    {
        $department = Department::firstOrCreate(['name' => 'Computer Science']);

        return Project::forceCreate(array_merge([
            'owner_id' => $owner->id,
            'title' => 'Initial Title',
            'description' => 'A valid project description for lifecycle testing.',
            'category' => ProjectCategory::Personal->value,
            'department_id' => $department->id,
            'slots_total' => 3,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Open->value,
        ], $attributes));
    }

    public function test_owner_can_view_edit_page_and_update_project(): void
    {
        $owner = $this->createVerifiedStudent();
        $project = $this->createProject($owner);
        $skill = Skill::create(['name' => 'Vue', 'slug' => 'vue', 'name_key' => 'vue']);

        $editResponse = $this->actingAs($owner)->get(route('projects.edit', $project));
        $editResponse->assertOk();

        $updateResponse = $this->actingAs($owner)->patch(route('projects.update', $project), [
            'title' => 'Updated Project Title',
            'description' => 'Updated detailed description satisfying length constraints.',
            'category' => ProjectCategory::Hackathon->value,
            'department_id' => $project->department_id,
            'slots_total' => 4,
            'hours_per_week' => 15,
            'duration_weeks' => 6,
            'application_deadline' => now()->addDays(20)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'skill_ids' => [$skill->id],
        ]);

        $updateResponse->assertSessionHasNoErrors();
        $updateResponse->assertRedirect(route('projects.show', $project));

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'Updated Project Title',
            'slots_total' => 4,
        ]);
    }

    public function test_stranger_cannot_edit_update_or_change_status(): void
    {
        $owner = $this->createVerifiedStudent();
        $stranger = $this->createVerifiedStudent();
        $project = $this->createProject($owner);

        $this->actingAs($stranger)->get(route('projects.edit', $project))->assertForbidden();

        $this->actingAs($stranger)->patch(route('projects.update', $project), [
            'title' => 'Hacked Title',
        ])->assertForbidden();

        $this->actingAs($stranger)->patch(route('projects.status', $project), [
            'status' => 'cancelled',
        ])->assertForbidden();
    }

    public function test_owner_cannot_lower_slots_below_accepted_member_count(): void
    {
        $owner = $this->createVerifiedStudent();
        $applicant1 = $this->createVerifiedStudent();
        $applicant2 = $this->createVerifiedStudent();
        $project = $this->createProject($owner, ['slots_total' => 3]);

        JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $applicant1->id,
            'message' => 'Valid join message here.',
            'status' => JoinRequestStatus::Accepted->value,
            'decided_at' => now(),
        ]);

        JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $applicant2->id,
            'message' => 'Valid join message here too.',
            'status' => JoinRequestStatus::Accepted->value,
            'decided_at' => now(),
        ]);

        // Attempt to lower slots_total to 1 (when 2 are accepted)
        $response = $this->actingAs($owner)->patch(route('projects.update', $project), [
            'title' => $project->title,
            'description' => $project->description,
            'category' => $project->category->value,
            'department_id' => $project->department_id,
            'slots_total' => 1,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'skill_ids' => [],
            'new_skills' => ['Python'],
        ]);

        $response->assertSessionHasErrors(['slots_total']);
    }

    public function test_owner_can_stop_recruiting_and_reopen(): void
    {
        $owner = $this->createVerifiedStudent();
        $project = $this->createProject($owner, ['status' => 'open']);

        // Stop recruiting -> in_progress
        $stopResponse = $this->actingAs($owner)->patch(route('projects.status', $project), [
            'status' => 'in_progress',
        ]);
        $stopResponse->assertSessionHas('success');
        $this->assertEquals(ProjectStatus::InProgress, $project->fresh()->status);

        // In progress project is excluded from default discover feed
        $viewer = $this->createVerifiedStudent();
        $feedResponse = $this->actingAs($viewer)->get(route('projects.index'));
        $feedResponse->assertInertia(fn ($page) => $page->has('projects.data', 0));

        // Reopen -> open
        $reopenResponse = $this->actingAs($owner)->patch(route('projects.status', $project), [
            'status' => 'open',
        ]);
        $reopenResponse->assertSessionHas('success');
        $this->assertEquals(ProjectStatus::Open, $project->fresh()->status);
    }

    public function test_reopen_with_past_deadline_is_rejected(): void
    {
        $owner = $this->createVerifiedStudent();
        $project = $this->createProject($owner, [
            'status' => 'in_progress',
            'application_deadline' => now()->subDay()->toDateString(),
        ]);

        $response = $this->actingAs($owner)->patch(route('projects.status', $project), [
            'status' => 'open',
        ]);

        $response->assertSessionHas('error');
        $this->assertEquals(ProjectStatus::InProgress, $project->fresh()->status);
    }

    public function test_cancelling_project_is_terminal_and_blocks_further_edits(): void
    {
        $owner = $this->createVerifiedStudent();
        $project = $this->createProject($owner, ['status' => 'open']);

        $this->actingAs($owner)->patch(route('projects.status', $project), [
            'status' => 'cancelled',
        ]);

        $this->assertEquals(ProjectStatus::Cancelled, $project->fresh()->status);

        // Cannot transition from terminal cancelled
        $attemptTransition = $this->actingAs($owner)->patch(route('projects.status', $project), [
            'status' => 'open',
        ]);
        $attemptTransition->assertForbidden();

        // Cannot edit cancelled project
        $this->actingAs($owner)->get(route('projects.edit', $project))->assertForbidden();
    }
}
