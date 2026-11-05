<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\ProjectParticipant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileParticipationHistoryTest extends TestCase
{
    use RefreshDatabase;

    private function createStudent(): User
    {
        return User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    public function test_confirmed_credits_appear_on_student_profile(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $viewer = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Completed Robotics System',
            'description' => 'A valid project description for completion tests.',
            'category' => ProjectCategory::Academic->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Completed->value,
            'completed_at' => now(),
            'outcome_summary' => 'Built and tested robot hardware deliverable.',
            'outcome_url' => 'https://github.com/aau/robotics',
        ]);

        // Credited and Confirmed
        ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'member',
            'credited_at' => now(),
            'confirmed_at' => now(),
        ]);

        $response = $this->actingAs($viewer)->get(route('students.show', $member));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Students/Show')
            ->has('completedProjects', 1)
            ->where('completedProjects.0.title', 'Completed Robotics System')
            ->where('completedProjects.0.role', 'member')
            ->where('completedProjects.0.outcome_summary', 'Built and tested robot hardware deliverable.')
            ->where('completedProjects.0.outcome_url', 'https://github.com/aau/robotics')
        );
    }

    public function test_unconfirmed_credits_do_not_appear_on_profile(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $viewer = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Unconfirmed Project',
            'description' => 'A valid project description.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Completed->value,
            'completed_at' => now(),
            'outcome_summary' => 'Finished work on time.',
        ]);

        // Credited but NOT confirmed
        ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'member',
            'credited_at' => now(),
            'confirmed_at' => null,
        ]);

        $response = $this->actingAs($viewer)->get(route('students.show', $member));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Students/Show')
            ->has('completedProjects', 0)
        );
    }

    public function test_soft_deleted_completed_projects_do_not_appear_on_profile(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $viewer = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Deleted Project',
            'description' => 'A valid project description.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Completed->value,
            'completed_at' => now(),
            'outcome_summary' => 'Work finished before removal.',
        ]);

        ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'member',
            'credited_at' => now(),
            'confirmed_at' => now(),
        ]);

        // Soft delete the project (e.g., admin moderation)
        $project->delete();

        $response = $this->actingAs($viewer)->get(route('students.show', $member));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Students/Show')
            ->has('completedProjects', 0)
        );
    }
}
