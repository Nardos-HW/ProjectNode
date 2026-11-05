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

class ParticipantInvariantTest extends TestCase
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

    public function test_creating_project_automatically_creates_owner_participant_row(): void
    {
        $owner = $this->createStudent();
        $skill = Skill::create(['name' => 'PHP', 'slug' => 'php', 'name_key' => 'php']);

        $response = $this->actingAs($owner)->post(route('projects.store'), [
            'title' => 'Project with Participant Row',
            'description' => 'A valid project description for participant testing.',
            'category' => ProjectCategory::Personal->value,
            'department_id' => $owner->department_id,
            'slots_total' => 3,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_handle',
            'skill_ids' => [$skill->id],
        ]);

        $response->assertRedirect();
        $project = Project::latest('id')->first();

        $this->assertDatabaseHas('project_participants', [
            'project_id' => $project->id,
            'user_id' => $owner->id,
            'role' => 'owner',
            'join_request_id' => null,
        ]);
    }

    public function test_accepting_join_request_atomically_creates_member_participant_row(): void
    {
        $owner = $this->createStudent();
        $applicant = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Sample Collaboration',
            'description' => 'Valid description text.',
            'category' => ProjectCategory::Hackathon->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_handle',
            'status' => ProjectStatus::Open->value,
        ]);

        $project->participants()->create([
            'user_id' => $owner->id,
            'role' => 'owner',
        ]);

        $request = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'Valid application message.',
            'status' => JoinRequestStatus::Pending->value,
        ]);

        $response = $this->actingAs($owner)->patch(route('join-requests.accept', $request));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('project_participants', [
            'project_id' => $project->id,
            'user_id' => $applicant->id,
            'role' => 'member',
            'join_request_id' => $request->id,
        ]);
    }
}
