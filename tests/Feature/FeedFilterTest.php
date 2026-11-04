<?php

namespace Tests\Feature;

use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\Department;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FeedFilterTest extends TestCase
{
    use RefreshDatabase;

    private function createStudent(): User
    {
        return User::factory()->create([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);
    }

    private function createProject(User $owner, array $attributes = []): Project
    {
        return Project::forceCreate(array_merge([
            'owner_id' => $owner->id,
            'title' => 'Sample Project',
            'description' => 'A valid and long enough project description for filter testing.',
            'category' => ProjectCategory::Personal->value,
            'slots_total' => 2,
            'hours_per_week' => 10,
            'duration_weeks' => 4,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_tg',
            'status' => ProjectStatus::Open->value,
        ], $attributes));
    }

    public function test_keyword_search_matches_title_and_description_case_insensitively(): void
    {
        $owner = $this->createStudent();
        $viewer = $this->createStudent();

        $match1 = $this->createProject($owner, ['title' => 'Artificial Intelligence Bot']);
        $match2 = $this->createProject($owner, ['description' => 'Working on neural network INTELLIGENCE algorithms.']);
        $nomatch = $this->createProject($owner, ['title' => 'Web App Development']);

        $response = $this->actingAs($viewer)->get(route('projects.index', ['q' => 'intelligence']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('projects.data', 2)
            ->where('projects.data.0.id', $match2->id)
            ->where('projects.data.1.id', $match1->id)
        );
    }

    public function test_keyword_search_escapes_like_wildcards_literally(): void
    {
        $owner = $this->createStudent();
        $viewer = $this->createStudent();

        $literal = $this->createProject($owner, ['title' => 'Project 100% Complete']);
        $other = $this->createProject($owner, ['title' => 'Project 100 Complete without sign']);

        $response = $this->actingAs($viewer)->get(route('projects.index', ['q' => '100%']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('projects.data', 1)
            ->where('projects.data.0.id', $literal->id)
        );
    }

    public function test_category_and_department_filters_combine_with_and(): void
    {
        $owner = $this->createStudent();
        $viewer = $this->createStudent();

        $csDept = Department::create(['name' => 'Computer Science']);
        $eeDept = Department::create(['name' => 'Electrical Engineering']);

        $match = $this->createProject($owner, [
            'category' => ProjectCategory::Hackathon->value,
            'department_id' => $csDept->id,
        ]);

        $wrongDept = $this->createProject($owner, [
            'category' => ProjectCategory::Hackathon->value,
            'department_id' => $eeDept->id,
        ]);

        $wrongCategory = $this->createProject($owner, [
            'category' => ProjectCategory::Academic->value,
            'department_id' => $csDept->id,
        ]);

        $response = $this->actingAs($viewer)->get(route('projects.index', [
            'category' => ProjectCategory::Hackathon->value,
            'department_id' => $csDept->id,
        ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('projects.data', 1)
            ->where('projects.data.0.id', $match->id)
        );
    }

    public function test_skills_filter_matches_any_selected_skill(): void
    {
        $owner = $this->createStudent();
        $viewer = $this->createStudent();

        $skillA = Skill::create(['name' => 'SkillA', 'slug' => 'skilla', 'name_key' => 'skilla']);
        $skillB = Skill::create(['name' => 'SkillB', 'slug' => 'skillb', 'name_key' => 'skillb']);
        $skillC = Skill::create(['name' => 'SkillC', 'slug' => 'skillc', 'name_key' => 'skillc']);

        $projA = $this->createProject($owner, ['title' => 'Project With Skill A']);
        $projA->skills()->sync([$skillA->id]);

        $projB = $this->createProject($owner, ['title' => 'Project With Skill B']);
        $projB->skills()->sync([$skillB->id]);

        $projC = $this->createProject($owner, ['title' => 'Project With Skill C']);
        $projC->skills()->sync([$skillC->id]);

        // Filter for skillA OR skillB
        $response = $this->actingAs($viewer)->get(route('projects.index', [
            'skills' => [$skillA->id, $skillB->id],
        ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('projects.data', 2)
        );
    }

    public function test_filters_persist_across_pagination_links(): void
    {
        $owner = $this->createStudent();
        $viewer = $this->createStudent();

        // Create 13 projects matching category Hackathon to force 2 pages
        for ($i = 1; $i <= 13; $i++) {
            $this->createProject($owner, [
                'title' => "Hackathon Project {$i}",
                'category' => ProjectCategory::Hackathon->value,
            ]);
        }

        $response = $this->actingAs($viewer)->get(route('projects.index', [
            'category' => ProjectCategory::Hackathon->value,
        ]));

        $response->assertOk();
        $response->assertInertia(function (Assert $page) {
            $page->has('projects.data', 12);
            $nextUrl = $page->toArray()['props']['projects']['links'][2]['url'] ?? '';
            $this->assertStringContainsString('category=hackathon', $nextUrl);
        });
    }
}