<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NavigationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_verified_user_can_access_all_nav_routes(): void
    {
        $user = User::factory()->create([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        $routes = [
            'dashboard',
            'projects.index',
            'projects.mine',
            'applications.index',
        ];

        foreach ($routes as $routeName) {
            $response = $this->actingAs($user)->get(route($routeName));
            $response->assertStatus(200);
        }
    }
}
