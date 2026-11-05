<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\Department;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private function createStudent(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'email' => 'student'.uniqid().'@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
            'telegram_handle' => 'valid_handle',
        ], $attributes));
    }

    public function test_dashboard_renders_with_expected_prop_structure_and_safe_data(): void
    {
        $department = Department::create(['name' => 'Computer Science']);
        $skill = Skill::create(['name' => 'Laravel', 'slug' => 'laravel', 'name_key' => 'laravel']);

        $user = $this->createStudent([
            'department_id' => $department->id,
            'year_of_study' => 3,
            'bio' => 'A valid biography text for testing.',
        ]);
        $user->skills()->sync([$skill->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('stats')
            ->has('attention')
            ->has('my_projects')
            ->has('matches')
            ->has('profile')
            ->where('profile.percent', 100)
            ->where('profile.missing', [])
        );
    }

    public function test_dashboard_matches_recommends_projects_based_on_skills(): void
    {
        $skillA = Skill::create(['name' => 'SkillA', 'slug' => 'skilla', 'name_key' => 'skilla']);
        $skillB = Skill::create(['name' => 'SkillB', 'slug' => 'skillb', 'name_key' => 'skillb']);

        $user = $this->createStudent();
        $user->skills()->sync([$skillA->id, $skillB->id]);

        $otherStudent = $this->createStudent();
        $matchingProject = Project::forceCreate([
            'owner_id' => $otherStudent->id,
            'title' => 'Matching Project',
            'description' => 'A valid project description for matching test.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 3,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Open->value,
        ]);
        $matchingProject->skills()->sync([$skillA->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('matches', 1)
            ->where('matches.0.id', $matchingProject->id)
            ->where('matches.0.matched_skills', ['SkillA'])
        );
    }

    public function test_dashboard_query_count_is_bounded_and_does_not_n_plus_one(): void
    {
        $user = $this->createStudent();
        $skill = Skill::create(['name' => 'TestSkill', 'slug' => 'testskill', 'name_key' => 'testskill']);
        $user->skills()->sync([$skill->id]);

        // Seed several projects and requests
        for ($i = 0; $i < 5; $i++) {
            $creator = $this->createStudent();
            $proj = Project::forceCreate([
                'owner_id' => $creator->id,
                'title' => "Project {$i}",
                'description' => "Description for project {$i} with sufficient text.",
                'category' => ProjectCategory::Personal->value,
                'slots_total' => 2,
                'hours_per_week' => 5,
                'duration_weeks' => 2,
                'application_deadline' => now()->addDays(7)->toDateString(),
                'telegram_contact' => 'page_handle',
                'status' => ProjectStatus::Open->value,
            ]);
            $proj->skills()->sync([$skill->id]);
        }

        DB::flushQueryLog();
        DB::enableQueryLog();

        $this->actingAs($user)->get(route('dashboard'));

        $queries = DB::getQueryLog();
        // Assert total queries executed is reasonable (under 20 queries, avoiding N+1 loops)
        $this->assertLessThan(20, count($queries));
    }
}
