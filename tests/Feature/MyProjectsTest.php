<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MyProjectsTest extends TestCase
{
    use RefreshDatabase;

    private function createProject(User $owner, array $attributes = []): Project
    {
        return Project::forceCreate(array_merge([
            'owner_id' => $owner->id,
            'title' => 'Project of '.$owner->name,
            'description' => 'A valid project description with enough length to satisfy tests.',
            'category' => ProjectCategory::Personal,
            'slots_total' => 3,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => 'open',
        ], $attributes));
    }

    public function test_discover_feed_always_excludes_user_own_projects(): void
    {
        $user = User::factory()->create([
            'email' => 'student1'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        $otherStudent = User::factory()->create([
            'email' => 'student2'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        $ownProject = $this->createProject($user, ['title' => 'My Exclusive Project']);
        $otherProject = $this->createProject($otherStudent, ['title' => 'Other Student Project']);

        $response = $this->actingAs($user)->get(route('projects.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->has('projects.data', 1)
            ->where('projects.data.0.id', $otherProject->id)
            ->where('projects.data.0.title', 'Other Student Project')
        );
    }

    public function test_my_projects_shows_only_authenticated_user_projects(): void
    {
        $user = User::factory()->create([
            'email' => 'owner'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        $stranger = User::factory()->create([
            'email' => 'stranger'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        $ownProject = $this->createProject($user, ['title' => 'My Personal Project']);
        $strangerProject = $this->createProject($stranger, ['title' => 'Stranger Project']);

        $response = $this->actingAs($user)->get(route('projects.mine'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Mine')
            ->has('projects.data', 1)
            ->where('projects.data.0.id', $ownProject->id)
            ->where('projects.data.0.title', 'My Personal Project')
        );
    }

    public function test_my_projects_can_filter_by_status(): void
    {
        $user = User::factory()->create([
            'email' => 'owner'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        $openProject = $this->createProject($user, ['title' => 'Open Project', 'status' => 'open']);
        $completedProject = $this->createProject($user, ['title' => 'Done Project', 'status' => 'completed']);

        $response = $this->actingAs($user)->get(route('projects.mine', ['status' => 'completed']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Mine')
            ->has('projects.data', 1)
            ->where('projects.data.0.id', $completedProject->id)
            ->where('projects.data.0.status', 'completed')
        );
    }
}
