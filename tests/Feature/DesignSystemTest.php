<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DesignSystemTest extends TestCase
{
    use RefreshDatabase;

    public function test_design_system_preview_returns_ok_in_local_environment(): void
    {
        $user = User::factory()->create([
            'email' => 'designer'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->get(route('design-system'));

        $response->assertStatus(200);
    }

    public function test_design_system_preview_is_not_found_in_production(): void
    {
        // Re-boot application under production environment
        putenv('APP_ENV=production');
        $_ENV['APP_ENV'] = 'production';
        $_SERVER['APP_ENV'] = 'production';

        $this->refreshApplication();

        $user = User::factory()->create([
            'email' => 'user'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->get('/design-system');

        $response->assertStatus(404);

        // Reset environment back to testing
        putenv('APP_ENV=testing');
        $_ENV['APP_ENV'] = 'testing';
        $_SERVER['APP_ENV'] = 'testing';
        $this->refreshApplication();
    }
}
