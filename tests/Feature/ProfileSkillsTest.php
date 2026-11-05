<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileSkillsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_profile_with_existing_and_custom_skills(): void
    {
        $department = Department::create(['name' => 'Computer Science']);
        $existingSkill = Skill::create(['name' => 'Laravel', 'slug' => 'laravel', 'name_key' => 'laravel']);

        $user = User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'department_id' => $department->id,
            'year_of_study' => 3,
            'bio' => 'A valid biography string that meets min length requirement.',
            'telegram_handle' => 'valid_handle',
            'profile_completed_at' => now(),
        ]);

        $response = $this->actingAs($user)->patch(route('profile.update'), [
            'name' => 'Updated Name',
            'department_id' => $department->id,
            'year_of_study' => 4,
            'bio' => 'An updated biography text with sufficient length.',
            'interests' => 'Machine Learning',
            'telegram_handle' => 'valid_handle',
            'skill_ids' => [$existingSkill->id],
            'new_skills' => ['TensorFlow', 'PyTorch'],
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('profile.edit'));

        $this->assertDatabaseHas('skills', ['name' => 'TensorFlow', 'name_key' => 'tensorflow', 'is_custom' => true]);
        $this->assertDatabaseHas('skills', ['name' => 'PyTorch', 'name_key' => 'pytorch', 'is_custom' => true]);

        $user->refresh();
        $this->assertCount(3, $user->skills);
    }

    public function test_peer_student_view_displays_skills_and_omits_email_and_telegram(): void
    {
        $department = Department::create(['name' => 'Computer Science']);
        $skill = Skill::create(['name' => 'Docker', 'slug' => 'docker', 'name_key' => 'docker']);

        $subject = User::factory()->create([
            'email' => 'subject'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'department_id' => $department->id,
            'year_of_study' => 3,
            'bio' => 'A public student bio for testing peer views.',
            'interests' => 'DevOps',
            'telegram_handle' => 'secret_tg_handle',
            'profile_completed_at' => now(),
        ]);
        $subject->skills()->sync([$skill->id]);

        $viewer = User::factory()->create([
            'email' => 'viewer'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        $response = $this->actingAs($viewer)->get(route('students.show', $subject));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Students/Show')
            ->where('student.name', $subject->name)
            ->where('student.department', 'Computer Science')
            ->where('student.skills.0.name', 'Docker')
            ->missing('student.email')
            ->missing('student.telegram_handle')
        );
    }
}
