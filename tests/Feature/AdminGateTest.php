<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AdminGateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Register temporary test route using the 'admin' middleware
        Route::middleware(['web', 'auth', 'admin'])->get('/_test/admin-gate', function () {
            return response()->json(['status' => 'admin_granted']);
        });
    }

    public function test_guest_is_redirected_from_admin_gate(): void
    {
        $response = $this->get('/_test/admin-gate');

        $response->assertRedirect(route('login'));
    }

    public function test_regular_student_receives_forbidden_from_admin_gate(): void
    {
        $student = User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'role' => 'student',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($student)->get('/_test/admin-gate');

        $response->assertForbidden();
    }

    public function test_admin_user_passes_through_admin_gate(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin'.uniqid().'@aau.edu.et',
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->get('/_test/admin-gate');

        $response->assertOk();
        $response->assertJson(['status' => 'admin_granted']);
    }

    public function test_student_cannot_escalate_role_via_profile_update(): void
    {
        $student = User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'role' => 'student',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
            'telegram_handle' => 'legit_handle',
        ]);

        $dept = Department::create(['name' => 'Engineering']);
        $skill = Skill::create(['name' => 'Testing', 'slug' => 'testing', 'name_key' => 'testing']);

        $response = $this->actingAs($student)->patch(route('profile.update'), [
            'name' => 'Escalation Attempt',
            'role' => 'admin',
            'department_id' => $dept->id,
            'year_of_study' => 3,
            'bio' => 'Attempting privilege escalation via form post.',
            'telegram_handle' => 'legit_handle',
            'skill_ids' => [$skill->id],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals('student', $student->fresh()->role);
    }
}
