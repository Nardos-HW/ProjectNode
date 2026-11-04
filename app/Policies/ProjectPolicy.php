<?php

namespace App\Policies;

use App\Enums\JoinRequestStatus;
use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Determine whether the user can create projects.
     */
    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail();
    }

    /**
     * Determine whether the user can update the project.
     */
    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id && $project->status === 'open';
    }

    /**
     * Determine whether the user can delete the project.
     */
    public function delete(User $user, Project $project): bool
    {
        if ($user->id !== $project->owner_id || $project->status === 'completed') {
            return false;
        }

        return ! $project->acceptedRequests()->exists();
    }

    /**
     * Determine whether the user can view the project's Telegram contact.
     */
    public function viewContact(User $user, Project $project): bool
    {
        if ($user->id === $project->owner_id || ($user->role ?? null) === 'admin') {
            return true;
        }

        return $project->acceptedRequests()
            ->where('applicant_id', $user->id)
            ->exists();
    }
}