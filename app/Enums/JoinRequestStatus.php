<?php

namespace App\Enums;

enum JoinRequestStatus: string
{
    case Pending = 'pending';
    case Accepted = 'accepted';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending Review',
            self::Accepted => 'Accepted',
            self::Rejected => 'Declined',
            self::Withdrawn => 'Withdrawn',
        };
    }
}
