<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminNavigationTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_cannot_access_any_admin_page(): void
    {
        $student = User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'role' => 'student',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        $this->actingAs($student)->get(route('admin.users.index'))->assertForbidden();
        $this->actingAs($student)->get(route('admin.projects.index'))->assertForbidden();
        $this->actingAs($student)->get(route('admin.audit-logs.index'))->assertForbidden();
    }

    public function test_admin_can_access_all_admin_pages(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin'.uniqid().'@aau.edu.et',
            'role' => 'admin',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        $this->actingAs($admin)->get(route('admin.users.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.projects.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.audit-logs.index'))->assertOk();
    }
}
