<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AdminUserModerationTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'email' => 'admin'.uniqid().'@aau.edu.et',
            'role' => 'admin',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    private function createStudent(): User
    {
        return User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'role' => 'student',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    public function test_admin_can_suspend_student_with_logged_reason_and_session_eviction(): void
    {
        $admin = $this->createAdmin();
        $student = $this->createStudent();

        // Seed a session row for the student
        DB::table('sessions')->insert([
            'id' => 'test_session_id',
            'user_id' => $student->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'PHPUnit',
            'payload' => 'payload',
            'last_activity' => time(),
        ]);

        $response = $this->actingAs($admin)->post(route('admin.users.suspend', $student), [
            'reason' => 'Repeated academic integrity violations across multiple submissions.',
        ]);

        $response->assertSessionHas('success');
        $student->refresh();

        $this->assertNotNull($student->suspended_at);
        $this->assertEquals('Repeated academic integrity violations across multiple submissions.', $student->suspension_reason);

        // Session was evicted
        $this->assertDatabaseMissing('sessions', ['user_id' => $student->id]);

        // Action was audited
        $this->assertDatabaseHas('moderation_actions', [
            'admin_id' => $admin->id,
            'action' => 'user_suspended',
            'target_type' => 'user',
            'target_id' => $student->id,
        ]);
    }

    public function test_admin_cannot_suspend_themselves_or_another_admin(): void
    {
        $admin1 = $this->createAdmin();
        $admin2 = $this->createAdmin();

        $this->actingAs($admin1)->post(route('admin.users.suspend', $admin1), [
            'reason' => 'Self suspension attempt',
        ])->assertForbidden();

        $this->actingAs($admin1)->post(route('admin.users.suspend', $admin2), [
            'reason' => 'Admin peer suspension attempt',
        ])->assertForbidden();
    }

    public function test_suspended_user_is_redirected_to_suspended_notice_page(): void
    {
        $student = $this->createStudent();
        $student->forceFill([
            'suspended_at' => now(),
            'suspension_reason' => 'Cheating on assignment.',
        ])->save();

        $response = $this->actingAs($student)->get(route('dashboard'));

        $response->assertRedirect(route('suspended'));

        $noticeResponse = $this->actingAs($student)->get(route('suspended'));
        $noticeResponse->assertOk();
    }

    public function test_suspended_users_projects_are_hidden_from_discovery_feed(): void
    {
        $student = $this->createStudent();
        $viewer = $this->createStudent();

        $project = Project::forceCreate([
            'owner_id' => $student->id,
            'title' => 'Project of Suspended Student',
            'description' => 'Valid description text for student project listing.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Open->value,
        ]);

        // Before suspension: project shows in feed
        $this->actingAs($viewer)->get(route('projects.index'))->assertInertia(fn ($page) => $page->has('projects.data', 1));

        // Suspend the student
        $student->forceFill(['suspended_at' => now(), 'suspension_reason' => 'Violation'])->save();

        // After suspension: project vanishes from feed per BR-13
        $this->actingAs($viewer)->get(route('projects.index'))->assertInertia(fn ($page) => $page->has('projects.data', 0));
    }
}
