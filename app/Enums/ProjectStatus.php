<?php

namespace App\Enums;

enum ProjectStatus: string
{
    case Open = 'open';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Open => 'Open',
            self::InProgress => 'In Progress',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Completed, self::Cancelled], true);
    }

    public function canTransitionTo(self $target): bool
    {
        if ($this->isTerminal()) {
            return false;
        }

        return match ($this) {
            self::Open => in_array($target, [self::InProgress, self::Cancelled, self::Completed], true),
            self::InProgress => in_array($target, [self::Open, self::Cancelled, self::Completed], true),
            default => false,
        };
    }
}
