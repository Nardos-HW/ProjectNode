<?php

namespace App\Http\Controllers;

use App\Actions\CompleteProject;
use App\Exceptions\WorkflowException;
use App\Http\Requests\CompleteProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProjectCompletionController extends Controller
{
    public function create(Project $project): Response
    {
        Gate::authorize('complete', $project);

        $members = $project->members()
            ->with(['user:id,name,department_id,year_of_study', 'user.department:id,name'])
            ->get()
            ->map(fn ($m) => [
                'user_id' => $m->user_id,
                'name' => $m->user?->name ?? 'Student',
                'department' => $m->user?->department?->name ?? 'Campus Member',
                'year_of_study' => $m->user?->year_of_study,
            ]);

        return Inertia::render('Projects/Complete', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'category' => $project->category->value,
            ],
            'members' => $members,
        ]);
    }

    public function store(CompleteProjectRequest $request, Project $project, CompleteProject $action): RedirectResponse
    {
        try {
            $action->execute(
                $project,
                $request->validated(),
                $request->validated('credited_user_ids', [])
            );
        } catch (WorkflowException $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project marked as completed and participation credits issued.');
    }
}