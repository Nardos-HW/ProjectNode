<?php

namespace App\Http\Controllers;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectStatus;
use App\Http\Requests\StoreJoinRequestRequest;
use App\Models\JoinRequest;
use App\Models\Project;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class JoinRequestController extends Controller
{
    /**
     * Store a newly created join request.
     */
    public function store(StoreJoinRequestRequest $request, Project $project): RedirectResponse
    {
        // Owners cannot apply to their own project
        abort_if($project->owner_id === $request->user()->id, 403, 'You cannot apply to your own project.');

        if (! $project->isRecruiting()) {
            return back()->withErrors(['message' => 'This project is not currently accepting applications.']);
        }

        // Friendly pre-check query (File 03, Section 3.6)
        if ($project->joinRequests()->where('applicant_id', $request->user()->id)->exists()) {
            return back()->withErrors(['message' => 'You have already applied to this project.']);
        }

        try {
            DB::transaction(function () use ($project, $request) {
                $project->joinRequests()->create([
                    'applicant_id' => $request->user()->id,
                    'message' => $request->validated('message'),
                    'status' => JoinRequestStatus::Pending,
                ]);
            });
        } catch (UniqueConstraintViolationException $e) {
            return back()->withErrors(['message' => 'You have already applied to this project.']);
        }

        return back()->with('success', 'Application submitted successfully.');
    }

    /**
     * Display the owner inbox for a project's join requests.
     */
    public function index(Project $project, Request $request): Response
    {
        Gate::authorize('viewAny', [JoinRequest::class, $project]);

        $requests = $project->joinRequests()
            ->with([
                'conversation:id,join_request_id',
                'applicant' => fn ($query) => $query->select('id', 'name', 'department_id', 'year_of_study', 'bio', 'telegram_handle')
                    ->with('department:id,name', 'skills:id,name'),
            ])
            ->latest()
            ->get();

        $requests->each(function ($req) {
            $req->conversation_id = $req->conversation?->id;
        });

        return Inertia::render('Projects/Requests', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slots_total' => $project->slots_total,
                'accepted_count' => $project->acceptedRequests()->count(),
            ],
            'requests' => $requests,
        ]);
    }

    /**
     * Accept a pending join request with row locking to ensure capacity is not exceeded.
     */
    public function accept(Request $request, JoinRequest $joinRequest): RedirectResponse
    {
        Gate::authorize('decide', $joinRequest);

        $errorMessage = null;

        DB::transaction(function () use ($joinRequest, &$errorMessage) {
            $project = Project::whereKey($joinRequest->project_id)->lockForUpdate()->firstOrFail();
            $requestModel = JoinRequest::whereKey($joinRequest->id)->lockForUpdate()->firstOrFail();

            $statusValue = $requestModel->status instanceof JoinRequestStatus 
                ? $requestModel->status->value 
                : $requestModel->status;

            if ($statusValue !== JoinRequestStatus::Pending->value) {
                $errorMessage = 'This request has already been decided.';
                return;
            }

            $projectStatusValue = $project->status instanceof ProjectStatus
                ? $project->status->value
                : $project->status;

            if (! in_array($projectStatusValue, ['open', 'in_progress'], true)) {
                $errorMessage = 'This project is no longer active.';
                return;
            }

            $acceptedCount = $project->acceptedRequests()->count();
            if ($acceptedCount >= $project->slots_total) {
                $errorMessage = 'Cannot accept applicant: project has reached full capacity.';
                return;
            }

            $requestModel->forceFill([
                'status' => JoinRequestStatus::Accepted->value,
                'decided_at' => now(),
            ])->save();

            // Record participant row
            $project->participants()->firstOrCreate(
                ['user_id' => $requestModel->applicant_id],
                [
                    'role' => 'member',
                    'join_request_id' => $requestModel->id,
                ]
            );

            // Record conversation
            \App\Models\Conversation::firstOrCreate(
                ['join_request_id' => $requestModel->id],
                [
                    'project_id' => $project->id,
                    'owner_id' => $project->owner_id,
                    'member_id' => $requestModel->applicant_id,
                ]
            );
        });

        if ($errorMessage) {
            return back()->withErrors(['message' => $errorMessage]);
        }

        return back()->with('success', 'Applicant accepted into project.');
    }
    
    /**
     * Reject a pending join request.
     */
    public function reject(JoinRequest $joinRequest): RedirectResponse
    {
        Gate::authorize('decide', $joinRequest);

        $changed = JoinRequest::whereKey($joinRequest->id)
            ->where('status', JoinRequestStatus::Pending)
            ->update([
                'status' => JoinRequestStatus::Rejected,
                'decided_at' => now(),
            ]);

        if ($changed === 0) {
            return back()->withErrors(['message' => 'This request has already been decided.']);
        }

        return back()->with('success', 'Application declined.');
    }

    /**
     * Display the authenticated student's sent applications.
     */
    public function mine(Request $request): Response
    {
        $applications = $request->user()->joinRequests()
            ->with([
                'conversation:id,join_request_id',
                'project' => fn ($q) => $q->select('id', 'title', 'owner_id', 'telegram_contact')->with('owner:id,name'),
            ])
            ->latest()
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'message' => $app->message,
                    'status' => $app->status->value,
                    'status_label' => $app->status->label(),
                    'created_at' => $app->created_at->toFormattedDateString(),
                    'conversation_id' => $app->status === JoinRequestStatus::Accepted ? $app->conversation?->id : null,
                    'project' => [
                        'id' => $app->project->id,
                        'title' => $app->project->title,
                        'owner_name' => $app->project->owner?->name,
                        // Reveal telegram contact only if accepted
                        'telegram_contact' => $app->status === JoinRequestStatus::Accepted ? $app->project->telegram_contact : null,
                    ],
                ];
            });

        return Inertia::render('Applications/Index', [
            'applications' => $applications,
        ]);
    }
}