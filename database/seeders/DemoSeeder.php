<?php

namespace Database\Seeders;

use App\Enums\ProjectCategory;
use App\Models\Department;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Departments & Key Skills
        $cs = Department::firstOrCreate(['name' => 'Computer Science']);
        $se = Department::firstOrCreate(['name' => 'Software Engineering']);
        $is = Department::firstOrCreate(['name' => 'Information Systems']);
        $ee = Department::firstOrCreate(['name' => 'Electrical Engineering']);

        $findSkill = function (string $name, string $slug) {
            return Skill::where('name', $name)
                ->orWhere('slug', $slug)
                ->first() ?? Skill::create(['name' => $name, 'slug' => $slug]);
        };

        $laravel  = $findSkill('Laravel', 'laravel');
        $react    = $findSkill('React', 'react');
        $python   = $findSkill('Python', 'python');
        $uiux     = $findSkill('UI/UX Design', 'ui-ux-design');
        $postgres = $findSkill('PostgreSQL', 'postgresql');
        $tailwind = $findSkill('Tailwind CSS', 'tailwind-css');
        $fastapi  = $findSkill('FastAPI', 'fastapi');

        // 2. Demo Student 1: Abebe Kebede (Owner)
        $abebe = User::updateOrCreate(
            ['email' => 'abebe@aau.edu.et'],
            [
                'name' => 'Abebe Kebede',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'department_id' => $cs->id,
                'year_of_study' => 3,
                'bio' => 'Junior CS student passionate about building practical software for AAU campus life.',
                'interests' => 'Web Systems, Distributed Infrastructure',
                'telegram_handle' => 'abebe_k',
                'profile_completed_at' => now(),
            ]
        );
        $abebe->skills()->sync([$laravel->id, $react->id, $tailwind->id]);

        // 3. Demo Student 2: Hana Tesfaye (First Applicant)
        $hana = User::updateOrCreate(
            ['email' => 'hana@aau.edu.et'],
            [
                'name' => 'Hana Tesfaye',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'department_id' => $is->id,
                'year_of_study' => 2,
                'bio' => 'Information Systems enthusiast focused on UI/UX research, wireframing, and frontend development.',
                'interests' => 'Product Design, Usability',
                'telegram_handle' => 'hana_t',
                'profile_completed_at' => now(),
            ]
        );
        $hana->skills()->sync([$uiux->id, $react->id]);

        // 4. Demo Student 3: Samuel Alemu (Second Applicant)
        $samuel = User::updateOrCreate(
            ['email' => 'samuel@aau.edu.et'],
            [
                'name' => 'Samuel Alemu',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'department_id' => $se->id,
                'year_of_study' => 4,
                'bio' => 'Senior software engineering student building data pipelines and backend web APIs.',
                'interests' => 'Data Engineering, Cloud Architecture',
                'telegram_handle' => 'samuel_a',
                'profile_completed_at' => now(),
            ]
        );
        $samuel->skills()->sync([$python->id, $postgres->id, $fastapi->id]);

        // 5. Target Demo Project: Campus Bus Tracker (1 Slot Capacity)
        $targetProject = Project::forceCreate([
            'owner_id' => $abebe->id,
            'title' => 'AAU Campus Shuttle Tracker',
            'description' => 'A lightweight mobile-responsive web application tracking internal campus shuttle arrival times between 4 Kilo, 5 Kilo, and 6 Kilo campuses. Looking for an enthusiastic designer/frontend developer to create intuitive stop schedules.',
            'category' => ProjectCategory::StudentInitiative,
            'department_id' => $cs->id,
            'slots_total' => 1,
            'hours_per_week' => 8,
            'duration_weeks' => 6,
            'application_deadline' => now()->addDays(10)->toDateString(),
            'telegram_contact' => 'abebe_k',
            'status' => 'open',
        ]);
        $targetProject->skills()->sync([$laravel->id, $react->id, $uiux->id]);

        // 6. Additional Seed Projects (To test feed discovery and pagination)
        $otherProjects = [
            [
                'owner' => $abebe,
                'title' => 'AAU Hackathon Team - FinTech Track',
                'description' => 'Forming a 4-person team for the upcoming national inter-university hackathon. Need backend and data engineers familiar with PostgreSQL and modern payment APIs.',
                'category' => ProjectCategory::Hackathon,
                'dept' => $cs,
                'slots' => 3,
                'hours' => 12,
                'weeks' => 3,
                'skills' => [$python->id, $postgres->id],
                'days' => 7,
            ],
            [
                'owner' => $samuel,
                'title' => 'Distributed Sensor Network Dashboard',
                'description' => 'Academic capstone project visualizing environmental telemetry data across laboratory nodes at 5 Kilo campus. Need clean charting and Tailwind CSS layouts.',
                'category' => ProjectCategory::Academic,
                'dept' => $se,
                'slots' => 2,
                'hours' => 10,
                'weeks' => 12,
                'skills' => [$react->id, $fastapi->id],
                'days' => 14,
            ],
            [
                'owner' => $hana,
                'title' => 'Peer Tutoring & Study Group Exchange',
                'description' => 'A web portal matching upperclassmen tutors with freshmen students in engineering fundamentals. Looking for a fullstack developer to help build the scheduling engine.',
                'category' => ProjectCategory::Personal,
                'dept' => $is,
                'slots' => 2,
                'hours' => 6,
                'weeks' => 8,
                'skills' => [$laravel->id, $tailwind->id],
                'days' => 21,
            ],
            [
                'owner' => $samuel,
                'title' => 'Amharic OCR Pipeline Integration',
                'description' => 'Open-source initiative training lightweight vision models to digitize AAU library archives and past examination papers. Python and PyTorch proficiency preferred.',
                'category' => ProjectCategory::StudentInitiative,
                'dept' => $se,
                'slots' => 3,
                'hours' => 15,
                'weeks' => 10,
                'skills' => [$python->id, $postgres->id],
                'days' => 18,
            ],
            [
                'owner' => $abebe,
                'title' => 'Dormitory Maintenance Ticketing Portal',
                'description' => 'Streamlined issue reporting system for student dormitories. Enables facility managers to receive and resolve maintenance requests with photo logs.',
                'category' => ProjectCategory::StudentInitiative,
                'dept' => $cs,
                'slots' => 2,
                'hours' => 8,
                'weeks' => 5,
                'skills' => [$laravel->id, $react->id],
                'days' => 12,
            ],
        ];

        foreach ($otherProjects as $p) {
            $proj = Project::forceCreate([
                'owner_id' => $p['owner']->id,
                'title' => $p['title'],
                'description' => $p['description'],
                'category' => $p['category'],
                'department_id' => $p['dept']->id,
                'slots_total' => $p['slots'],
                'hours_per_week' => $p['hours'],
                'duration_weeks' => $p['weeks'],
                'application_deadline' => now()->addDays($p['days'])->toDateString(),
                'telegram_contact' => $p['owner']->telegram_handle,
                'status' => 'open',
            ]);
            $proj->skills()->sync($p['skills']);
        }
    }
}