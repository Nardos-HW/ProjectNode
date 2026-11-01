<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    private function createVerifiedUser(): User
    {
        return User::factory()->create([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
        ]);
    }

    private function createSampleProject(User $owner): Project
    {
        return Project::forceCreate([
            'owner_id' => $owner->id,
            'title' => 'Test Project Listing',
            'description' => 'A valid project description with enough characters to pass validation checks.',
            'category' => ProjectCategory::Personal,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'test_handle',
            'status' => 'open',
        ]);
    }

    public function test_feed_only_lists_active_recruiting_projects(): void
    {
        $user = $this->createVerifiedUser();
        $active = $this->createSampleProject($user);

        $expired = Project::forceCreate([
            'owner_id' => $user->id,
            'title' => 'Expired Project Listing',
            'description' => 'A valid project description for an expired project listing.',
            'category' => ProjectCategory::Academic,
            'slots_total' => 2,
            'hours_per_week' => 5,
            'duration_weeks' => 4,
            'application_deadline' => now()->subDays(2)->toDateString(),
            'telegram_contact' => 'test_handle',
            'status' => 'open',
        ]);

        $response = $this->actingAs($user)->get(route('projects.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->has('projects.data', 1)
            ->where('projects.data.0.title', $active->title)
        );
    }

    public function test_telegram_contact_is_hidden_from_stranger_props(): void
    {
        $owner = $this->createVerifiedUser();
        $stranger = $this->createVerifiedUser();
        $project = $this->createSampleProject($owner);

        $response = $this->actingAs($stranger)->get(route('projects.show', $project));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Show')
            ->missing('project.telegram_contact')
            ->where('can.viewContact', false)
            ->where('can.delete', false)
        );
    }

    public function test_telegram_contact_is_visible_to_accepted_applicant_props(): void
    {
        $owner = $this->createVerifiedUser();
        $applicant = $this->createVerifiedUser();
        $project = $this->createSampleProject($owner);

        \App\Models\JoinRequest::create([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'Applying to collaborate on project.',
            'status' => \App\Enums\JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $response = $this->actingAs($applicant)->get(route('projects.show', $project));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Show')
            ->where('project.telegram_contact', $project->telegram_contact)
            ->where('can.viewContact', true)
        );
    }

    public function test_stranger_cannot_delete_another_users_project(): void
    {
        $owner = $this->createVerifiedUser();
        $stranger = $this->createVerifiedUser();
        $project = $this->createSampleProject($owner);

        $response = $this->actingAs($stranger)->delete(route('projects.destroy', $project));

        $response->assertForbidden();
        $this->assertNotSoftDeleted($project);
    }

    public function test_owner_can_delete_own_project(): void
    {
        $owner = $this->createVerifiedUser();
        $project = $this->createSampleProject($owner);

        $response = $this->actingAs($owner)->delete(route('projects.destroy', $project));

        $response->assertRedirect(route('projects.index'));
        $this->assertSoftDeleted($project);
    }

    public function test_owner_cannot_delete_project_with_accepted_members(): void
    {
        $owner = $this->createVerifiedUser();
        $applicant = $this->createVerifiedUser();
        $project = $this->createSampleProject($owner);

        \App\Models\JoinRequest::create([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'Accepted team member.',
            'status' => \App\Enums\JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $response = $this->actingAs($owner)->delete(route('projects.destroy', $project));

        $response->assertSessionHasErrors('message');
        $this->assertNotSoftDeleted($project);
        $this->assertFalse(\Illuminate\Support\Facades\Gate::forUser($owner)->allows('delete', $project));
    }
}