<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileGateTest extends TestCase
{
    use RefreshDatabase;

    public function test_incomplete_profile_is_redirected_from_project_creation(): void
    {
        $user = User::factory()->create([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => null,
        ]);

        $response = $this->actingAs($user)->get(route('projects.create'));

        $response->assertRedirect(route('profile.edit'));
        $response->assertSessionHas('info');
    }

    public function test_completed_profile_can_access_project_creation(): void
    {
        $dept = Department::create(['name' => 'Software Engineering']);
        $user = User::factory()->create([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
            'department_id' => $dept->id,
            'year_of_study' => 3,
            'bio' => 'A valid student biography with enough length.',
            'telegram_handle' => 'valid_handle',
            'profile_completed_at' => now(),
        ]);

        $response = $this->actingAs($user)->get(route('projects.create'));

        $response->assertStatus(200);
    }

    public function test_peer_profile_view_never_exposes_email_or_telegram_handle(): void
    {
        $dept = Department::create(['name' => 'Computer Science']);
        $skill = Skill::create(['name' => 'Laravel', 'slug' => 'laravel']);

        $owner = User::factory()->create([
            'name' => 'Target Student',
            'email' => 'secret@aau.edu.et',
            'email_verified_at' => now(),
            'department_id' => $dept->id,
            'year_of_study' => 4,
            'bio' => 'Passionate backend developer.',
            'interests' => 'Distributed Systems',
            'telegram_handle' => 'secret_telegram',
            'profile_completed_at' => now(),
        ]);
        $owner->skills()->attach($skill->id);

        $viewer = User::factory()->create([
            'email' => 'viewer' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($viewer)->get(route('students.show', $owner));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Students/Show')
            ->where('student.name', 'Target Student')
            ->where('student.department', 'Computer Science')
            ->where('student.year_of_study', 4)
            ->where('student.bio', 'Passionate backend developer.')
            ->where('student.interests', 'Distributed Systems')
            ->has('student.skills', 1)
            ->missing('student.email')
            ->missing('student.telegram_handle')
        );
    }
}