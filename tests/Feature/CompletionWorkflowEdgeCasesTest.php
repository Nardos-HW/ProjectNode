<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\Department;
use App\Models\JoinRequest;
use App\Models\Project;
use App\Models\ProjectParticipant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompletionWorkflowEdgeCasesTest extends TestCase
{
    use RefreshDatabase;

    private function createStudent(): User
    {
        $dept = Department::firstOrCreate(['name' => 'Computer Science']);

        return User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'department_id' => $dept->id,
            'year_of_study' => 3,
            'bio' => 'A valid biography string that meets requirements.',
            'telegram_handle' => 'valid_handle',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    private function createSampleProject(User $owner, ProjectStatus $status = ProjectStatus::Open): Project
    {
        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Completion Edge Case Project',
            'description' => 'A valid project description for thorough completion tests.',
            'category' => ProjectCategory::Academic->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => $status->value,
        ]);

        $project->participants()->create([
            'user_id' => $owner->id,
            'role' => 'owner',
        ]);

        return $project;
    }

    public function test_owner_can_complete_project_crediting_nobody(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $project = $this->createSampleProject($owner);

        $memberPart = ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'member',
        ]);

        $response = $this->actingAs($owner)->post(route('projects.complete.store', $project), [
            'outcome_summary' => 'Finished alone because collaborator did not contribute.',
            'credited_user_ids' => [],
        ]);

        $response->assertRedirect(route('projects.show', $project));
        $project->refresh();

        $this->assertEquals(ProjectStatus::Completed, $project->status);

        // Owner is confirmed
        $ownerPart = $project->participants()->where('role', 'owner')->first();
        $this->assertNotNull($ownerPart->credited_at);
        $this->assertNotNull($ownerPart->confirmed_at);

        // Member is uncredited
        $memberPart->refresh();
        $this->assertNull($memberPart->credited_at);
        $this->assertNull($memberPart->confirmed_at);
    }

    public function test_cannot_complete_cancelled_project(): void
    {
        $owner = $this->createStudent();
        $project = $this->createSampleProject($owner, ProjectStatus::Cancelled);

        $response = $this->actingAs($owner)->post(route('projects.complete.store', $project), [
            'outcome_summary' => 'Attempting to complete an already cancelled project.',
            'credited_user_ids' => [],
        ]);

        $response->assertForbidden();
    }

    public function test_second_completion_attempt_is_idempotent(): void
    {
        $owner = $this->createStudent();
        $project = $this->createSampleProject($owner);

        // Initial completion
        $this->actingAs($owner)->post(route('projects.complete.store', $project), [
            'outcome_summary' => 'Initial valid outcome summary description.',
            'credited_user_ids' => [],
        ])->assertRedirect();

        $project->refresh();
        $originalCompletedAt = $project->completed_at;

        // Second completion call
        $response = $this->actingAs($owner)->post(route('projects.complete.store', $project), [
            'outcome_summary' => 'Tampered outcome summary on second submission.',
            'credited_user_ids' => [],
        ]);

        // Policy denies completion on already completed projects
        $response->assertForbidden();
        $project->refresh();

        $this->assertEquals('Initial valid outcome summary description.', $project->outcome_summary);
        $this->assertEquals($originalCompletedAt->toDateTimeString(), $project->completed_at->toDateTimeString());
    }

    public function test_double_confirmation_is_rejected(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $project = $this->createSampleProject($owner, ProjectStatus::Completed);

        $participant = ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'member',
            'credited_at' => now(),
            'confirmed_at' => now()->subDay(),
        ]);

        $originalConfirmedAt = $participant->confirmed_at;

        // Attempting to confirm an already confirmed row
        $response = $this->actingAs($member)->patch(route('participants.confirm', $participant));

        $response->assertSessionHasErrors('message');
        $participant->refresh();

        $this->assertEquals($originalConfirmedAt->toDateTimeString(), $participant->confirmed_at->toDateTimeString());
    }

    public function test_full_lifecycle_from_application_to_profile_history(): void
    {
        $owner = $this->createStudent();
        $applicant = $this->createStudent();
        $project = $this->createSampleProject($owner);

        // 1. Applicant submits join request
        $this->actingAs($applicant)->post(route('projects.join', $project), [
            'message' => 'I would love to collaborate on the robotics control module.',
        ])->assertSessionHasNoErrors();

        $joinRequest = JoinRequest::where('project_id', $project->id)->first();
        $this->assertNotNull($joinRequest);

        // 2. Owner accepts join request (atomically creates participant row)
        $this->actingAs($owner)->patch(route('join-requests.accept', $joinRequest))->assertSessionHasNoErrors();

        $participant = ProjectParticipant::where('project_id', $project->id)
            ->where('user_id', $applicant->id)
            ->first();
        $this->assertNotNull($participant);
        $this->assertEquals('member', $participant->role);

        // 3. Owner completes project and credits applicant
        $this->actingAs($owner)->post(route('projects.complete.store', $project), [
            'outcome_summary' => 'Successfully engineered autonomous path planning algorithms.',
            'outcome_url' => 'https://github.com/aau/robotics-control',
            'credited_user_ids' => [$applicant->id],
        ])->assertRedirect(route('projects.show', $project));

        $participant->refresh();
        $this->assertNotNull($participant->credited_at);
        $this->assertNull($participant->confirmed_at);

        // 4. Check applicant profile: unconfirmed credit is NOT visible
        $this->actingAs($owner)->get(route('students.show', $applicant))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('completedProjects', 0));

        // 5. Applicant confirms credit
        $this->actingAs($applicant)->patch(route('participants.confirm', $participant))
            ->assertSessionHas('success');

        $participant->refresh();
        $this->assertNotNull($participant->confirmed_at);

        // 6. Check applicant profile: confirmed credit IS visible
        $this->actingAs($owner)->get(route('students.show', $applicant))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('completedProjects', 1)
                ->where('completedProjects.0.title', $project->title)
                ->where('completedProjects.0.role', 'member')
                ->where('completedProjects.0.role_label', 'Confirmed Contributor')
                ->where('completedProjects.0.outcome_summary', 'Successfully engineered autonomous path planning algorithms.')
            );
    }
}
