<?php

namespace Tests\Feature;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectCategory;
use App\Models\JoinRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JoinRequestTest extends TestCase
{
    use RefreshDatabase;

    private function createStudent(): User
    {
        return User::factory()->create([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    private function createProject(User $owner, int $slots = 1): Project
    {
        return Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Test Project',
            'description' => 'A project description that passes validation character minimums.',
            'category' => ProjectCategory::Personal,
            'slots_total' => $slots,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_telegram',
            'status' => 'open',
        ]);
    }

    public function test_student_can_apply_to_recruiting_project(): void
    {
        $owner = $this->createStudent();
        $applicant = $this->createStudent();
        $project = $this->createProject($owner);

        $response = $this->actingAs($applicant)->post(route('projects.join', $project), [
            'message' => 'I would love to contribute with React and Tailwind skills.',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('join_requests', [
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'status' => JoinRequestStatus::Pending->value,
        ]);
    }

    public function test_owner_cannot_apply_to_own_project(): void
    {
        $owner = $this->createStudent();
        $project = $this->createProject($owner);

        $response = $this->actingAs($owner)->post(route('projects.join', $project), [
            'message' => 'Applying to my own project should be blocked.',
        ]);

        $response->assertForbidden();
    }

    public function test_duplicate_application_is_blocked(): void
    {
        $owner = $this->createStudent();
        $applicant = $this->createStudent();
        $project = $this->createProject($owner);

        JoinRequest::create([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'First valid application message.',
            'status' => JoinRequestStatus::Pending,
        ]);

        $response = $this->actingAs($applicant)->post(route('projects.join', $project), [
            'message' => 'Second attempt should be rejected as duplicate.',
        ]);

        $response->assertSessionHasErrors('message');
        $this->assertCount(1, $project->joinRequests);
    }

    public function test_owner_can_accept_applicant_and_capacity_is_enforced(): void
    {
        $owner = $this->createStudent();
        $applicant1 = $this->createStudent();
        $applicant2 = $this->createStudent();
        
        // Project with exactly 1 opening
        $project = $this->createProject($owner, slots: 1);

        $request1 = JoinRequest::create([
            'project_id' => $project->id,
            'applicant_id' => $applicant1->id,
            'message' => 'First applicant message.',
            'status' => JoinRequestStatus::Pending,
        ]);

        $request2 = JoinRequest::create([
            'project_id' => $project->id,
            'applicant_id' => $applicant2->id,
            'message' => 'Second applicant message.',
            'status' => JoinRequestStatus::Pending,
        ]);

        // Accept first applicant
        $response1 = $this->actingAs($owner)->patch(route('join-requests.accept', $request1));
        $response1->assertSessionHasNoErrors();
        $this->assertSame(JoinRequestStatus::Accepted, $request1->fresh()->status);

        // Attempt to accept second applicant exceeds capacity of 1
        $response2 = $this->actingAs($owner)->patch(route('join-requests.accept', $request2));
        $response2->assertSessionHasErrors('message');
        $this->assertSame(JoinRequestStatus::Pending, $request2->fresh()->status);
    }

    public function test_stranger_cannot_decide_join_request(): void
    {
        $owner = $this->createStudent();
        $applicant = $this->createStudent();
        $stranger = $this->createStudent();
        $project = $this->createProject($owner);

        $request = JoinRequest::create([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'Applicant message.',
            'status' => JoinRequestStatus::Pending,
        ]);

        $response = $this->actingAs($stranger)->patch(route('join-requests.accept', $request));
        $response->assertForbidden();
    }
    public function test_student_can_view_their_submitted_applications(): void
    {
        $owner = $this->createStudent();
        $applicant = $this->createStudent();
        $project = $this->createProject($owner);

        JoinRequest::create([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'Applying to collaborate.',
            'status' => JoinRequestStatus::Pending,
        ]);

        $response = $this->actingAs($applicant)->get(route('applications.index'));

        $response->assertOk();
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Applications/Index')
            ->has('applications', 1)
            ->where('applications.0.project.title', $project->title)
            ->where('applications.0.status', 'pending')
        );
    }
}