<?php

namespace Tests\Feature;

use App\Models\ModerationAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminAuditLogTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'email' => 'admin' . uniqid() . '@aau.edu.et',
            'role' => 'admin',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    private function createStudent(): User
    {
        return User::factory()->create([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'role' => 'student',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    public function test_admin_can_view_audit_log_with_actions(): void
    {
        $admin = $this->createAdmin();
        $student = $this->createStudent();

        ModerationAction::create([
            'admin_id' => $admin->id,
            'action' => 'user_suspended',
            'target_type' => 'user',
            'target_id' => $student->id,
            'reason' => 'Violation of community standards.',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.audit-logs.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/AuditLogs/Index')
            ->has('actions.data', 1)
            ->where('actions.data.0.action', 'user_suspended')
            ->where('actions.data.0.reason', 'Violation of community standards.')
            ->where('actions.data.0.admin.email', $admin->email)
        );
    }

    public function test_student_cannot_view_audit_log(): void
    {
        $student = $this->createStudent();

        $this->actingAs($student)->get(route('admin.audit-logs.index'))->assertForbidden();
    }
}