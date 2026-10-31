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
        // 1. Create 3 verified AAU demo students
        $abebe = User::firstOrCreate(
            ['email' => 'abebe@aau.edu.et'],
            [
                'name' => 'Abebe Kebede',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $hana = User::firstOrCreate(
            ['email' => 'hana@aau.edu.et'],
            [
                'name' => 'Hana Tesfaye',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $samuel = User::firstOrCreate(
            ['email' => 'samuel@aau.edu.et'],
            [
                'name' => 'Samuel Alemu',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $csDept = Department::where('name', 'Computer Science')->first();
        $seDept = Department::where('name', 'Software Engineering')->first();
        $isDept = Department::where('name', 'Information Systems')->first();

        $allSkills = Skill::all()->keyBy('name');

        // 2. Define 12 realistic projects across categories
        $projectsData = [
            [
                'owner_id' => $abebe->id,
                'title' => 'Campus Bus Tracker',
                'description' => "Real-time tracker for AAU shuttle buses between 4 Kilo, 5 Kilo, and 6 Kilo campuses. Looking for frontend and backend contributors to help finalize the web dashboard.",
                'category' => ProjectCategory::StudentInitiative,
                'department_id' => $csDept?->id,
                'slots_total' => 2,
                'hours_per_week' => 8,
                'duration_weeks' => 6,
                'application_deadline' => now()->addDays(21)->toDateString(),
                'telegram_contact' => 'abebe_k',
                'skills' => ['Laravel', 'React', 'Tailwind CSS'],
            ],
            [
                'owner_id' => $abebe->id,
                'title' => 'AAU Hackathon Team (HealthTech)',
                'description' => "Forming a 4-person team for the upcoming national university hackathon. We are designing a mobile clinic queue management app for Tikur Anbessa Hospital.",
                'category' => ProjectCategory::Hackathon,
                'department_id' => $seDept?->id,
                'slots_total' => 3,
                'hours_per_week' => 15,
                'duration_weeks' => 2,
                'application_deadline' => now()->addDays(5)->toDateString(),
                'telegram_contact' => 'abebe_k',
                'skills' => ['Flutter', 'Python', 'FastAPI', 'Figma'],
            ],
            [
                'owner_id' => $hana->id,
                'title' => 'Study Group Matching App',
                'description' => "Academic project matching 1st and 2nd year students with upper-class study mentors based on shared courses and schedule availability.",
                'category' => ProjectCategory::Academic,
                'department_id' => $isDept?->id,
                'slots_total' => 2,
                'hours_per_week' => 6,
                'duration_weeks' => 8,
                'application_deadline' => now()->addDays(14)->toDateString(),
                'telegram_contact' => 'hana_t',
                'skills' => ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
            ],
            [
                'owner_id' => $hana->id,
                'title' => 'Campus Event Calendar & Noticeboard',
                'description' => "A centralized, verified bulletin board for student club meetings, tech talks, and guest lectures across all AAU institutes.",
                'category' => ProjectCategory::StudentInitiative,
                'department_id' => $isDept?->id,
                'slots_total' => 1,
                'hours_per_week' => 5,
                'duration_weeks' => 4,
                'application_deadline' => now()->addDays(12)->toDateString(),
                'telegram_contact' => 'hana_t',
                'skills' => ['Vue.js', 'Tailwind CSS', 'Laravel'],
            ],
            [
                'owner_id' => $samuel->id,
                'title' => 'Amharic Sentiment Analysis on Campus Reviews',
                'description' => "NLP research project processing student feedback and course reviews in Amharic script using transformer models.",
                'category' => ProjectCategory::Academic,
                'department_id' => $csDept?->id,
                'slots_total' => 2,
                'hours_per_week' => 10,
                'duration_weeks' => 10,
                'application_deadline' => now()->addDays(25)->toDateString(),
                'telegram_contact' => 'samuel_a',
                'skills' => ['Python', 'Machine Learning', 'Data Analysis'],
            ],
            [
                'owner_id' => $samuel->id,
                'title' => 'Peer-to-Peer Textbook Exchange',
                'description' => "Simple portal for students to sell or exchange engineering textbooks at the end of each semester instead of letting them sit unused.",
                'category' => ProjectCategory::Personal,
                'department_id' => $seDept?->id,
                'slots_total' => 1,
                'hours_per_week' => 4,
                'duration_weeks' => 3,
                'application_deadline' => now()->addDays(18)->toDateString(),
                'telegram_contact' => 'samuel_a',
                'skills' => ['React', 'Tailwind CSS', 'PostgreSQL'],
            ],
            [
                'owner_id' => $abebe->id,
                'title' => 'Dormitory Maintenance Issue Reporter',
                'description' => "Digital ticketing system to report water and electricity issues in student dormitories directly to facilities management.",
                'category' => ProjectCategory::StudentInitiative,
                'department_id' => $csDept?->id,
                'slots_total' => 2,
                'hours_per_week' => 6,
                'duration_weeks' => 5,
                'application_deadline' => now()->addDays(9)->toDateString(),
                'telegram_contact' => 'abebe_k',
                'skills' => ['PHP', 'Laravel', 'MySQL'],
            ],
            [
                'owner_id' => $hana->id,
                'title' => 'AAU Competitive Programming Portal',
                'description' => "Platform hosting weekly programming challenges and campus-wide leaderboards for ICPC training sessions.",
                'category' => ProjectCategory::Academic,
                'department_id' => $csDept?->id,
                'slots_total' => 2,
                'hours_per_week' => 8,
                'duration_weeks' => 7,
                'application_deadline' => now()->addDays(30)->toDateString(),
                'telegram_contact' => 'hana_t',
                'skills' => ['Python', 'Docker', 'React'],
            ],
            [
                'owner_id' => $samuel->id,
                'title' => 'Robotics Club Telemetry Dashboard',
                'description' => "Building an IoT web interface to visualize sensor data streamed from microcontrollers over WebSockets.",
                'category' => ProjectCategory::Personal,
                'department_id' => $seDept?->id,
                'slots_total' => 1,
                'hours_per_week' => 12,
                'duration_weeks' => 4,
                'application_deadline' => now()->addDays(7)->toDateString(),
                'telegram_contact' => 'samuel_a',
                'skills' => ['TypeScript', 'Node.js', 'UI/UX Design'],
            ],
            [
                'owner_id' => $abebe->id,
                'title' => 'Digital Cafeteria Menu & Feedback',
                'description' => "Daily menu display and nutrition breakdown for the central student cafeteria with an anonymous rating system.",
                'category' => ProjectCategory::StudentInitiative,
                'department_id' => $isDept?->id,
                'slots_total' => 1,
                'hours_per_week' => 5,
                'duration_weeks' => 3,
                'application_deadline' => now()->addDays(15)->toDateString(),
                'telegram_contact' => 'abebe_k',
                'skills' => ['React', 'Tailwind CSS'],
            ],
            [
                'owner_id' => $hana->id,
                'title' => 'Open Source AAU Map & Indoor Navigation',
                'description' => "Interactive map of 5 Kilo campus buildings, lecture halls, and department offices using OpenStreetMap.",
                'category' => ProjectCategory::Hackathon,
                'department_id' => $seDept?->id,
                'slots_total' => 3,
                'hours_per_week' => 10,
                'duration_weeks' => 4,
                'application_deadline' => now()->addDays(16)->toDateString(),
                'telegram_contact' => 'hana_t',
                'skills' => ['JavaScript', 'Figma', 'UI/UX Design'],
            ],
            [
                'owner_id' => $samuel->id,
                'title' => 'Expired Senior Capstone Archive',
                'description' => "This is a past project whose deadline passed 5 days ago to test that expired listings are excluded from the active recruiting feed.",
                'category' => ProjectCategory::Academic,
                'department_id' => $csDept?->id,
                'slots_total' => 2,
                'hours_per_week' => 5,
                'duration_weeks' => 4,
                'application_deadline' => now()->subDays(5)->toDateString(),
                'telegram_contact' => 'samuel_a',
                'skills' => ['Technical Writing', 'Git'],
            ],
        ];

        foreach ($projectsData as $data) {
            $skillNames = $data['skills'];
            unset($data['skills']);

            $project = Project::updateOrCreate(
                ['title' => $data['title']],
                $data
            );

            $skillIds = collect($skillNames)
                ->map(fn ($name) => $allSkills->get($name)?->id)
                ->filter()
                ->values();

            $project->skills()->sync($skillIds);
        }
    }
}