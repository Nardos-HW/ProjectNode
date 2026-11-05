<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\ProjectParticipant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ParticipationConfirmationTest extends TestCase
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

    public function test_credited_member_can_confirm_their_participation_credit(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Completed Web Platform',
            'description' => 'Valid description text.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Completed->value,
            'completed_at' => now(),
            'outcome_summary' => 'Built the platform successfully.',
        ]);

        $participant = ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'member',
            'credited_at' => now(),
            'confirmed_at' => null,
        ]);

        $response = $this->actingAs($member)->patch(route('participants.confirm', $participant));

        $response->assertSessionHas('success');
        $participant->refresh();

        $this->assertNotNull($participant->confirmed_at);
    }

    public function test_stranger_cannot_confirm_another_students_credit(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $stranger = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Sample Project',
            'description' => 'Valid description text.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Completed->value,
            'completed_at' => now(),
            'outcome_summary' => 'Built the platform successfully.',
        ]);

        $participant = ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'member',
            'credited_at' => now(),
            'confirmed_at' => null,
        ]);

        $this->actingAs($stranger)->patch(route('participants.confirm', $participant))->assertForbidden();
    }

    public function test_uncredited_member_cannot_confirm(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Sample Project',
            'description' => 'Valid description text.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Completed->value,
            'completed_at' => now(),
            'outcome_summary' => 'Built the platform successfully.',
        ]);

        $participant = ProjectParticipant::create([
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'member',
            'credited_at' => null, // Not credited
            'confirmed_at' => null,
        ]);

        $response = $this->actingAs($member)->patch(route('participants.confirm', $participant));

        $response->assertSessionHasErrors('message');
        $this->assertNull($participant->fresh()->confirmed_at);
    }
}
