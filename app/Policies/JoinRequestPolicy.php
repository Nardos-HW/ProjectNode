<?php

namespace App\Policies;

use App\Models\JoinRequest;
use App\Models\Project;
use App\Models\User;

class JoinRequestPolicy
{
    /**
     * Determine whether the user can view the project's incoming requests inbox.
     */
    public function viewAny(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id || ($user->role ?? null) === 'admin';
    }

    /**
     * Determine whether the user can accept or reject the request.
     */
    public function decide(User $user, JoinRequest $joinRequest): bool
    {
        return $user->id === $joinRequest->project->owner_id;
    }
}