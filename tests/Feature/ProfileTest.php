<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create([
            'email' => 'student@aau.edu.et',
            'email_verified_at' => now(),
        ]);

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_page_shares_logged_in_user_profile_fields_and_skill_ids(): void
    {
        $department = Department::create(['name' => 'Computer Science']);
        $skill = Skill::create(['name' => 'React', 'slug' => 'react']);

        $user = User::factory()->create([
            'email' => 'student@aau.edu.et',
            'email_verified_at' => now(),
            'department_id' => $department->id,
            'year_of_study' => 3,
            'bio' => 'A valid biography description for testing.',
            'interests' => 'Distributed Systems',
            'telegram_handle' => 'student_tg',
        ]);
        $user->skills()->attach($skill);

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Profile/Edit')
            ->where('auth.user.name', $user->name)
            ->where('auth.user.department_id', $department->id)
            ->where('auth.user.year_of_study', 3)
            ->where('auth.user.bio', 'A valid biography description for testing.')
            ->where('auth.user.interests', 'Distributed Systems')
            ->where('auth.user.telegram_handle', 'student_tg')
            ->where('auth.user.skill_ids', [$skill->id])
        );
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create([
            'email' => 'student@aau.edu.et',
            'email_verified_at' => now(),
        ]);
        $originalEmail = $user->email;

        $department = Department::create(['name' => 'Software Engineering']);
        $skill = Skill::create(['name' => 'Laravel', 'slug' => 'laravel']);

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Updated Student Name',
                'email' => 'tampered@example.com',
                'department_id' => $department->id,
                'year_of_study' => 3,
                'bio' => 'A valid student biography with enough length.',
                'interests' => 'Distributed Systems',
                'telegram_handle' => 'valid_handle',
                'skill_ids' => [$skill->id],
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Updated Student Name', $user->name);
        $this->assertSame($originalEmail, $user->email);
        $this->assertSame($department->id, $user->department_id);
        $this->assertSame(3, $user->year_of_study);
        $this->assertSame('valid_handle', $user->telegram_handle);
        $this->assertNotNull($user->profile_completed_at);
        $this->assertTrue($user->skills->contains($skill));
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create([
            'email' => 'student@aau.edu.et',
            'email_verified_at' => now(),
        ]);

        $department = Department::create(['name' => 'Software Engineering']);
        $skill = Skill::create(['name' => 'Laravel', 'slug' => 'laravel']);

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'department_id' => $department->id,
                'year_of_study' => 2,
                'bio' => 'A valid student biography with enough length.',
                'telegram_handle' => 'test_handle',
                'skill_ids' => [$skill->id],
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create([
            'email' => 'student@aau.edu.et',
            'email_verified_at' => now(),
        ]);

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create([
            'email' => 'student@aau.edu.et',
            'email_verified_at' => now(),
        ]);

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }
}