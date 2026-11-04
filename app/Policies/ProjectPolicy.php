<?php

namespace App\Policies;

use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Project $project): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Project $project): bool
    {
        if ($user->id !== $project->owner_id) {
            return false;
        }

        return $project->canBeEdited();
    }

    public function changeStatus(User $user, Project $project): bool
    {
        if ($user->id !== $project->owner_id) {
            return false;
        }

        $status = $project->status instanceof ProjectStatus ? $project->status : ProjectStatus::from($project->status);
        return ! $status->isTerminal();
    }

    public function delete(User $user, Project $project): bool
    {
        if ($user->id !== $project->owner_id) {
            return false;
        }

        return $project->canBeDeleted();
    }

    public function viewContact(?User $user, Project $project): bool
    {
        if (! $user) {
            return false;
        }

        if (($user->role ?? null) === 'admin') {
            return true;
        }

        if ($user->id === $project->owner_id) {
            return true;
        }

        return $project->joinRequests()
            ->where('applicant_id', $user->id)
            ->where('status', \App\Enums\JoinRequestStatus::Accepted)
            ->exists();
    }

    public function adminDelete(User $user, Project $project): bool
    {
        return $user->isAdmin() && ! $project->trashed();
    }

    public function adminRestore(User $user, Project $project): bool
    {
        return $user->isAdmin() && $project->trashed();
    }
    
}