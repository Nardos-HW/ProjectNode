<?php

namespace App\Http\Controllers;

use App\Enums\ProjectStatus;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display a public peer student profile.
     */
    public function show(User $user): Response
    {
        $user->load(['department:id,name', 'skills:id,name']);

        // Query confirmed participations on completed projects (FR-COMP-05, ADR-7)
        $completedProjects = $user->participations()
            ->whereNotNull('credited_at')
            ->whereNotNull('confirmed_at')
            ->whereHas('project', function ($q) {
                $q->where('status', ProjectStatus::Completed->value)
                    ->whereNull('deleted_at');
            })
            ->with(['project:id,title,category,outcome_summary,outcome_url,completed_at,owner_id', 'project.owner:id,name'])
            ->latest('confirmed_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->project->id,
                'title' => $p->project->title,
                'category' => $p->project->category->value,
                'role' => $p->role,
                'role_label' => $p->role === 'owner' ? 'Project Creator' : 'Confirmed Contributor',
                'outcome_summary' => $p->project->outcome_summary,
                'outcome_url' => $p->project->outcome_url,
                'completed_at' => $p->project->completed_at?->toFormattedDateString(),
                'owner_name' => $p->project->owner?->name,
            ]);

        return Inertia::render('Students/Show', [
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
                'department' => $user->department?->name ?? 'General Campus',
                'year_of_study' => $user->year_of_study,
                'bio' => $user->bio,
                'interests' => $user->interests,
                'skills' => $user->skills->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]),
            ],
            'completedProjects' => $completedProjects,
        ]);
    }
}
