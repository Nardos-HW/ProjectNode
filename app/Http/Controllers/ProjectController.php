<?php

namespace App\Http\Controllers;

use App\Enums\ProjectCategory;
use App\Http\Requests\StoreProjectRequest;
use App\Models\Department;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a paginated listing of recruiting projects.
     */
    public function index(Request $request): Response
    {
        $projects = Project::query()
            ->with(['owner:id,name', 'skills:id,name', 'department:id,name'])
            ->recruiting()
            ->latest()
            ->latest('id')
            ->paginate(config('projectnode.feed_page_size', 12))
            ->withQueryString();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Project::class);

        $categories = collect(ProjectCategory::cases())->map(fn ($category) => [
            'value' => $category->value,
            'label' => $category->label(),
        ]);

        return Inertia::render('Projects/Create', [
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'skills' => Skill::orderBy('name')->get(['id', 'name']),
            'categories' => $categories,
            'defaultTelegram' => $request->user()->telegram_handle ?? '',
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        Gate::authorize('create', Project::class);

        $project = DB::transaction(function () use ($request) {
            $project = new Project($request->safe()->except('skill_ids'));
            $project->owner_id = $request->user()->id;
            $project->status = 'open';
            $project->save();

            $project->skills()->sync($request->validated('skill_ids'));

            return $project;
        });

        return redirect()->route('projects.show', $project)->with('success', 'Project published.');
    }

    /**
     * Display the specified project detail page.
     */
    public function show(Project $project, Request $request): Response
    {
        $project->load(['owner:id,name', 'department:id,name', 'skills:id,name']);

        $user = $request->user();
        $existingRequest = $user
            ? $project->joinRequests()->where('applicant_id', $user->id)->first()
            : null;

        $projectData = [
            'id' => $project->id,
            'title' => $project->title,
            'description' => $project->description,
            'category' => $project->category->value,
            'department' => $project->department?->name,
            'slots_total' => $project->slots_total,
            'accepted_count' => $project->acceptedRequests()->count(),
            'hours_per_week' => $project->hours_per_week,
            'duration_weeks' => $project->duration_weeks,
            'application_deadline' => $project->application_deadline->toDateString(),
            'status' => $project->status,
            'is_recruiting' => $project->isRecruiting(),
            'owner' => [
                'id' => $project->owner->id,
                'name' => $project->owner->name,
            ],
            'skills' => $project->skills->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]),
        ];

        // Only attach telegram_contact when the viewer is authorized (FR-PROJ-05, FR-JOIN-09)
        if (Gate::allows('viewContact', $project)) {
            $projectData['telegram_contact'] = $project->telegram_contact;
        }

        return Inertia::render('Projects/Show', [
            'project' => $projectData,
            'existingRequest' => $existingRequest ? [
                'id' => $existingRequest->id,
                'status' => $existingRequest->status->value,
                'status_label' => $existingRequest->status->label(),
                'message' => $existingRequest->message,
            ] : null,
            'can' => [
                'delete' => Gate::allows('delete', $project),
                'viewContact' => Gate::allows('viewContact', $project),
                'manageRequests' => Gate::allows('viewAny', [\App\Models\JoinRequest::class, $project]),
                'apply' => $user && $user->id !== $project->owner_id && ! $existingRequest && $project->isRecruiting(),
            ],
        ]);
    }

    /**
     * Remove the specified project from storage (soft delete).
     */
    public function destroy(Project $project): RedirectResponse
    {
        Gate::authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted.');
    }
}