<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RemoveProjectRequest;
use App\Models\Department;
use App\Models\ModerationAction;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $departmentId = $request->input('department_id');
        $status = $request->input('status', 'all');

        $query = Project::withTrashed()
            ->with(['owner:id,name,email', 'department:id,name'])
            ->withCount(['acceptedRequests as accepted_count']);

        if ($search) {
            $term = '%' . addcslashes($search, '%_') . '%';
            $query->where(function ($sub) use ($term) {
                $sub->where('title', 'ILIKE', $term)
                    ->orWhere('description', 'ILIKE', $term);
            });
        }

        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        if ($status === 'removed') {
            $query->onlyTrashed();
        } elseif ($status === 'active') {
            $query->whereNull('deleted_at');
        }

        $projects = $query->latest('id')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => [
                'search' => $search,
                'department_id' => $departmentId,
                'status' => $status,
            ],
            'departments' => Department::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function destroy(RemoveProjectRequest $request, Project $project): RedirectResponse
    {
        Gate::authorize('adminDelete', $project);

        $reason = $request->validated('reason');

        DB::transaction(function () use ($request, $project, $reason) {
            $project->delete();

            ModerationAction::create([
                'admin_id' => $request->user()->id,
                'action' => 'project_removed',
                'target_type' => 'project',
                'target_id' => $project->id,
                'reason' => $reason,
            ]);
        });

        return back()->with('success', "Project '{$project->title}' was removed by moderation.");
    }

    public function restore(Request $request, int $projectId): RedirectResponse
    {
        $project = Project::onlyTrashed()->findOrFail($projectId);

        Gate::authorize('adminRestore', $project);

        $request->validate([
            'reason' => ['required', 'string', 'min:10', 'max:500'],
        ]);

        $reason = $request->input('reason');

        DB::transaction(function () use ($request, $project, $reason) {
            $project->restore();

            ModerationAction::create([
                'admin_id' => $request->user()->id,
                'action' => 'project_restored',
                'target_type' => 'project',
                'target_id' => $project->id,
                'reason' => $reason,
            ]);
        });

        return back()->with('success', "Project '{$project->title}' was restored.");
    }
}