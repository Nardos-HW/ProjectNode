<?php

namespace Database\Factories;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectCategory;
use App\Models\Conversation;
use App\Models\JoinRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Conversation>
 */
class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $project = Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Sample Collaboration Project',
            'description' => 'A comprehensive technical project description for testing purposes.',
            'category' => ProjectCategory::Academic,
            'slots_total' => 3,
            'hours_per_week' => 12,
            'duration_weeks' => 8,
            'application_deadline' => now()->addDays(20)->toDateString(),
            'telegram_contact' => 'owner_telegram',
            'status' => 'open',
        ]);

        $joinRequest = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'I would love to collaborate on this initiative.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        return [
            'join_request_id' => $joinRequest->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ];
    }
}
