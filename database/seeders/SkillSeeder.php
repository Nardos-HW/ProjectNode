<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            'Laravel', 'PHP', 'React', 'Vue.js', 'JavaScript', 'TypeScript',
            'Tailwind CSS', 'Node.js', 'Python', 'FastAPI', 'Django',
            'PostgreSQL', 'MySQL', 'MongoDB', 'Docker', 'Git',
            'Flutter', 'React Native', 'Kotlin', 'Swift',
            'UI/UX Design', 'Figma', 'Machine Learning', 'Data Analysis',
            'Cybersecurity', 'Technical Writing',
        ];

        foreach ($skills as $name) {
            Skill::updateOrCreate(
                ['name' => $name],
                ['slug' => Str::slug($name)]
            );
        }
    }
}