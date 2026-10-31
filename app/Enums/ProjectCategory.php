<?php

namespace App\Enums;

enum ProjectCategory: string
{
    case Personal = 'personal';
    case Hackathon = 'hackathon';
    case Academic = 'academic';
    case StudentInitiative = 'student_initiative';

    public function label(): string
    {
        return match ($this) {
            self::Personal => 'Personal',
            self::Hackathon => 'Hackathon',
            self::Academic => 'Academic',
            self::StudentInitiative => 'Student Initiative',
        };
    }
}