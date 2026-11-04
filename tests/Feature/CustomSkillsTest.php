<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Models\Department;
use App\Models\Skill;
use App\Models\User;
use App\Support\SkillResolver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class CustomSkillsTest extends TestCase
{
    use RefreshDatabase;

    public function test_skill_normalizes_and_deduplicates_by_name_key(): void
    {
        $user = User::factory()->create(['email' => 'student' . uniqid() . '@aau.edu.et']);

        $skill1 = Skill::findOrCreateByName('React JS', $user);
        $skill2 = Skill::findOrCreateByName('reactjs', $user);
        $skill3 = Skill::findOrCreateByName('  React   JS  ', $user);

        $this->assertEquals($skill1->id, $skill2->id);
        $this->assertEquals($skill1->id, $skill3->id);
        $this->assertDatabaseCount('skills', 1);
    }

    public function test_symbols_in_skills_coexist_distinctly(): void
    {
        $user = User::factory()->create(['email' => 'student' . uniqid() . '@aau.edu.et']);

        $c = Skill::findOrCreateByName('C', $user);
        $cpp = Skill::findOrCreateByName('C++', $user);
        $csharp = Skill::findOrCreateByName('C#', $user);
        $dotnet = Skill::findOrCreateByName('.NET', $user);

        $this->assertNotEquals($c->id, $cpp->id);
        $this->assertNotEquals($cpp->id, $csharp->id);
        $this->assertNotEquals($c->id, $dotnet->id);
        $this->assertDatabaseCount('skills', 4);
    }

    public function test_resolver_rejects_more_than_three_new_skills_per_submission(): void
    {
        $user = User::factory()->create(['email' => 'student' . uniqid() . '@aau.edu.et']);

        $this->expectException(ValidationException::class);

        SkillResolver::resolve([], ['Skill One', 'Skill Two', 'Skill Three', 'Skill Four'], $user, 10);
    }

    public function test_resolver_enforces_maximum_total_skill_limits(): void
    {
        $user = User::factory()->create(['email' => 'student' . uniqid() . '@aau.edu.et']);
        $existing = Skill::create(['name' => 'Skill1', 'slug' => 'skill1', 'name_key' => 'skill1']);

        $this->expectException(ValidationException::class);

        // Max limit set to 2, attempting to add 3 total
        SkillResolver::resolve([$existing->id], ['Skill Two', 'Skill Three'], $user, 2);
    }

    public function test_project_can_be_created_with_custom_skills(): void
    {
        $department = Department::create(['name' => 'Computer Science']);
        $user = User::factory()->create([
            'email' => 'creator' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
            'telegram_handle' => 'creator_tg',
        ]);

        $response = $this->actingAs($user)->post(route('projects.store'), [
            'title' => 'Project with Custom Skills',
            'description' => 'A valid and sufficiently detailed project description for testing.',
            'category' => ProjectCategory::Personal->value,
            'department_id' => $department->id,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'creator_tg',
            'skill_ids' => [],
            'new_skills' => ['Solidity', 'Web3.js'],
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('skills', [
            'name' => 'Solidity',
            'name_key' => 'solidity',
            'is_custom' => true,
            'created_by' => $user->id,
        ]);
        $this->assertDatabaseHas('skills', [
            'name' => 'Web3.js',
            'name_key' => 'web3.js',
            'is_custom' => true,
            'created_by' => $user->id,
        ]);
    }
}