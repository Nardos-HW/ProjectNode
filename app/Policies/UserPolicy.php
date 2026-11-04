<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $admin): bool
    {
        return $admin->isAdmin();
    }

    public function suspend(User $admin, User $target): bool
    {
        if (! $admin->isAdmin()) {
            return false;
        }

        // Cannot suspend self
        if ($admin->id === $target->id) {
            return false;
        }

        // Cannot suspend another admin
        if ($target->isAdmin()) {
            return false;
        }

        return ! $target->isSuspended();
    }

    public function unsuspend(User $admin, User $target): bool
    {
        if (! $admin->isAdmin()) {
            return false;
        }

        return $target->isSuspended();
    }
}