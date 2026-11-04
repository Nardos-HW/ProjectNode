<?php

namespace Tests\Feature;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\JoinRequest;
use App\Models\Project;
use App\Models\ProjectParticipant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectCompletionTest extends TestCase
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

    public function test_owner_can_complete_project_crediting_selected_members(): void
    {
        $owner = $this->createStudent();
        $member1 = $this->createStudent();
        $member2 = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Completion Target Project',
            'description' => 'A valid project description for completion tests.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 3,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Open->value,
        ]);

        $ownerPart = ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $owner->id,
            'role' => 'owner',
        ]);

        $part1 = ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member1->id,
            'role' => 'member',
        ]);

        $part2 = ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member2->id,
            'role' => 'member',
        ]);

        $response = $this->actingAs($owner)->post(route('projects.complete.store', $project), [
            'outcome_summary' => 'We successfully built and deployed the full application to staging.',
            'outcome_url' => 'https://github.com/aau/projectnode',
            'credited_user_ids' => [$member1->id], // Crediting only member 1
        ]);

        $response->assertRedirect(route('projects.show', $project));
        $project->refresh();

        $this->assertEquals(ProjectStatus::Completed, $project->status);
        $this->assertNotNull($project->completed_at);
        $this->assertEquals('We successfully built and deployed the full application to staging.', $project->outcome_summary);
        $this->assertEquals('https://github.com/aau/projectnode', $project->outcome_url);

        // Owner is credited and confirmed
        $ownerPart->refresh();
        $this->assertNotNull($ownerPart->credited_at);
        $this->assertNotNull($ownerPart->confirmed_at);

        // Member 1 is credited but not yet confirmed
        $part1->refresh();
        $this->assertNotNull($part1->credited_at);
        $this->assertNull($part1->confirmed_at);

        // Member 2 is neither credited nor confirmed
        $part2->refresh();
        $this->assertNull($part2->credited_at);
        $this->assertNull($part2->confirmed_at);
    }

    public function test_cannot_credit_arbitrary_student_not_in_project(): void
    {
        $owner = $this->createStudent();
        $stranger = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Completion Project',
            'description' => 'A valid project description for completion tests.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Open->value,
        ]);

        $project->participants()->create([
            'user_id' => $owner->id,
            'role' => 'owner',
        ]);

        $response = $this->actingAs($owner)->post(route('projects.complete.store', $project), [
            'outcome_summary' => 'We successfully built and deployed the full application.',
            'credited_user_ids' => [$stranger->id],
        ]);

        $response->assertSessionHasErrors('credited_user_ids.0');
    }

    public function test_completed_project_freezes_content_and_prevents_updates(): void
    {
        $owner = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Frozen Completed Project',
            'description' => 'A valid project description.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Completed->value,
            'completed_at' => now(),
            'outcome_summary' => 'Original outcome summary description.',
        ]);

        // Attempting to edit or update should be forbidden
        $this->actingAs($owner)->get(route('projects.edit', $project))->assertForbidden();
        $this->actingAs($owner)->put(route('projects.update', $project), [
            'title' => 'Attempting to change frozen title',
        ])->assertForbidden();
    }
}