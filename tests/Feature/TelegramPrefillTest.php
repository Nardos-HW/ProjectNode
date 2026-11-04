<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Models\Department;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TelegramPrefillTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_create_page_receives_user_telegram_handle_as_default(): void
    {
        $user = User::factory()->create([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
            'telegram_handle' => 'profile_handle',
        ]);

        $response = $this->actingAs($user)->get(route('projects.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Create')
            ->where('defaultTelegram', 'profile_handle')
        );
    }

    public function test_submitting_project_with_different_telegram_handle_does_not_override_profile(): void
    {
        $department = Department::create(['name' => 'Computer Science']);
        $skill = Skill::create(['name' => 'React', 'slug' => 'react']);

        $user = User::factory()->create([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
            'telegram_handle' => 'original_profile_handle',
        ]);

        $response = $this->actingAs($user)->post(route('projects.store'), [
            'title' => 'Project with Custom Telegram',
            'description' => 'A detailed description that satisfies minimum character requirements.',
            'category' => ProjectCategory::Personal->value,
            'department_id' => $department->id,
            'slots_total' => 3,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'override_project_handle',
            'skill_ids' => [$skill->id],
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        // Project has the override handle
        $this->assertDatabaseHas('projects', [
            'owner_id' => $user->id,
            'telegram_contact' => 'override_project_handle',
        ]);

        // User's profile handle remains unchanged (no write-back per L6)
        $this->assertEquals('original_profile_handle', $user->fresh()->telegram_handle);
    }
}