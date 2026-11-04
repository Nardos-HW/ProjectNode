<?php

namespace App\Http\Controllers;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Http\Requests\ProjectIndexRequest;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Department;
use App\Models\Project;
use App\Models\Skill;
use App\Support\SkillResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a paginated listing of recruiting projects (excludes own projects).
     */
    public function index(ProjectIndexRequest $request): Response
    {
        $filters = $request->validated();
        $includeClosed = $request->boolean('include_closed');
        $sort = $filters['sort'] ?? 'newest';

        $query = Project::query()
            ->with(['owner:id,name', 'department:id,name', 'skills:id,name'])
            ->withCount(['acceptedRequests as accepted_count'])
            ->where('owner_id', '!=', $request->user()->id)
            ->filter($filters);

        if (! $includeClosed) {
            $query->recruiting();
        } else {
            $query->where('status', '!=', ProjectStatus::Cancelled->value);
        }

        if ($sort === 'deadline') {
            $query->orderBy('application_deadline', 'asc')->orderBy('id', 'desc');
        } else {
            $query->latest('id');
        }

        $projects = $query->paginate(12)->withQueryString();

        $categories = collect(ProjectCategory::cases())->map(fn ($cat) => [
            'value' => $cat->value,
            'label' => $cat->label(),
        ]);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => $filters,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'skills' => Skill::orderBy('name')->get(['id', 'name']),
            'categories' => $categories,
        ]);
    }

    /**
     * Display the authenticated user's own projects.
     */
    public function mine(Request $request): Response
    {
        $status = $request->input('status', 'all');

        $projects = Project::query()
            ->where('owner_id', $request->user()->id)
            ->with(['department:id,name', 'skills:id,name'])
            ->withCount([
                'acceptedRequests as accepted_count',
                'joinRequests as pending_requests_count' => function ($query) {
                    $query->where('status', JoinRequestStatus::Pending);
                },
            ])
            ->when($status !== 'all' && in_array($status, ['open', 'in_progress', 'completed', 'cancelled']), function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Projects/Mine', [
            'projects' => $projects,
            'currentStatus' => $status,
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

        $finalSkillIds = SkillResolver::resolve(
            $request->validated('skill_ids', []),
            $request->validated('new_skills', []),
            $request->user(),
            10
        );

        $project = DB::transaction(function () use ($request, $finalSkillIds) {
            $project = Project::forceCreate([
                ...$request->safe()->except(['skill_ids', 'new_skills']),
                'owner_id' => $request->user()->id,
                'status' => ProjectStatus::Open->value,
            ]);

            $project->skills()->sync($finalSkillIds);

            // Record owner participant row (BR-14)
            $project->participants()->create([
                'user_id' => $request->user()->id,
                'role' => 'owner',
            ]);

            return $project;
        });

        return redirect()->route('projects.show', $project)->with('success', 'Project published.');
    }

    /**
     * Display the specified project detail page.
     */
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

        $statusValue = $project->status instanceof ProjectStatus ? $project->status->value : $project->status;

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
            'status' => $statusValue,
            'is_recruiting' => $project->isRecruiting(),
            'owner' => [
                'id' => $project->owner->id,
                'name' => $project->owner->name,
            ],
            'skills' => $project->skills->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]),
            'outcome_summary' => $project->outcome_summary,
            'outcome_url' => $project->outcome_url,
        ];

        // Omit key completely when not authorized (satisfies Inertia missing() assertions)
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
                'update' => Gate::allows('update', $project),
                'changeStatus' => Gate::allows('changeStatus', $project),
                'delete' => Gate::allows('delete', $project),
                'complete' => Gate::allows('complete', $project),
                'viewContact' => Gate::allows('viewContact', $project),
                'manageRequests' => Gate::allows('viewAny', [\App\Models\JoinRequest::class, $project]),
                'apply' => $user && $user->id !== $project->owner_id && ! $existingRequest && $project->isRecruiting(),
            ],
        ]);
    }

    /**
     * Show the form for editing the project.
     */
    public function edit(Project $project): Response
    {
        Gate::authorize('update', $project);

        $project->load(['skills:id,name']);

        $categories = collect(ProjectCategory::cases())->map(fn ($category) => [
            'value' => $category->value,
            'label' => $category->label(),
        ]);

        return Inertia::render('Projects/Edit', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'description' => $project->description,
                'category' => $project->category->value,
                'department_id' => $project->department_id,
                'slots_total' => $project->slots_total,
                'hours_per_week' => $project->hours_per_week,
                'duration_weeks' => $project->duration_weeks,
                'application_deadline' => $project->application_deadline->toDateString(),
                'telegram_contact' => $project->telegram_contact,
                'skill_ids' => $project->skills->pluck('id')->all(),
            ],
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'skills' => Skill::orderBy('name')->get(['id', 'name']),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        Gate::authorize('update', $project);

        $finalSkillIds = SkillResolver::resolve(
            $request->validated('skill_ids', []),
            $request->validated('new_skills', []),
            $request->user(),
            10
        );

        DB::transaction(function () use ($request, $project, $finalSkillIds) {
            $project->fill($request->safe()->except(['skill_ids', 'new_skills']));
            $project->save();

            $project->skills()->sync($finalSkillIds);
        });

        return redirect()->route('projects.show', $project)->with('success', 'Project updated successfully.');
    }

    /**
     * Update project recruitment/lifecycle status.
     */
    public function updateStatus(Request $request, Project $project): RedirectResponse
    {
        Gate::authorize('changeStatus', $project);

        $request->validate([
            'status' => ['required', 'string', 'in:open,in_progress,cancelled'],
        ]);

        $targetStatus = ProjectStatus::from($request->input('status'));
        $currentStatus = $project->status instanceof ProjectStatus
            ? $project->status
            : ProjectStatus::from($project->status);

        if (! $currentStatus->canTransitionTo($targetStatus)) {
            return back()->with('error', "Cannot transition project status from {$currentStatus->value} to {$targetStatus->value}.");
        }

        // Reopening check: deadline must be today or later
        if ($targetStatus === ProjectStatus::Open) {
            $today = now(config('app.timezone', 'Africa/Addis_Ababa'))->startOfDay();
            if ($project->application_deadline->lt($today)) {
                return back()->with('error', 'Extend the deadline first before reopening recruitment.');
            }
        }

        $project->forceFill(['status' => $targetStatus->value])->save();

        $message = match ($targetStatus) {
            ProjectStatus::InProgress => 'Recruitment stopped. Project is now in progress.',
            ProjectStatus::Open => 'Project reopened for applications.',
            ProjectStatus::Cancelled => 'Project has been cancelled.',
            default => 'Status updated.',
        };

        return back()->with('success', $message);
    }

    /**
     * Remove the specified project from storage (soft delete).
     */
    public function destroy(Project $project): RedirectResponse
    {
        // Stranger receives 403
        if (auth()->id() !== $project->owner_id) {
            abort(403);
        }

        // Owner with accepted members receives session validation error
        if (! $project->canBeDeleted()) {
            return back()->withErrors([
                'message' => 'Cannot delete project with accepted collaborators. Cancel the project instead.',
            ]);
        }

        Gate::authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted.');
    }
}