<?php

namespace App\Http\Controllers;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectStatus;
use App\Models\JoinRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user()->loadMissing(['skills:id,name']);
        $userSkillIds = $user->skills->pluck('id')->all();

        // 1. Pending Credits for current student
        $pendingCredits = $user->participations()
            ->where('role', 'member')
            ->whereNotNull('credited_at')
            ->whereNull('confirmed_at')
            ->with(['project:id,title,category,outcome_summary,outcome_url,owner_id', 'project.owner:id,name'])
            ->latest('credited_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'credited_at' => $p->credited_at?->toFormattedDateString(),
                'project' => [
                    'id' => $p->project->id,
                    'title' => $p->project->title,
                    'category' => $p->project->category->value,
                    'outcome_summary' => $p->project->outcome_summary,
                    'outcome_url' => $p->project->outcome_url,
                    'owner_name' => $p->project->owner?->name,
                ],
            ]);

        // 2. Stats
        $activeProjectsCount = Project::where('owner_id', $user->id)
            ->whereIn('status', [ProjectStatus::Open->value, ProjectStatus::InProgress->value])
            ->count();

        $pendingRequestsCount = JoinRequest::whereHas('project', function ($q) use ($user) {
            $q->where('owner_id', $user->id);
        })->where('status', JoinRequestStatus::Pending->value)->count();

        $myApplicationsCounts = JoinRequest::where('applicant_id', $user->id)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->all();

        $stats = [
            'active_projects' => $activeProjectsCount,
            'pending_requests' => $pendingRequestsCount,
            'applications' => [
                'pending' => $myApplicationsCounts[JoinRequestStatus::Pending->value] ?? 0,
                'accepted' => $myApplicationsCounts[JoinRequestStatus::Accepted->value] ?? 0,
                'rejected' => $myApplicationsCounts[JoinRequestStatus::Rejected->value] ?? 0,
            ],
        ];

        // 3. Attention
        $requestsToReview = JoinRequest::whereHas('project', function ($q) use ($user) {
            $q->where('owner_id', $user->id);
        })
            ->where('status', JoinRequestStatus::Pending->value)
            ->with(['applicant:id,name', 'project:id,title'])
            ->latest('id')
            ->take(5)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'applicant_name' => $r->applicant?->name ?? 'Student',
                'project_id' => $r->project_id,
                'project_title' => $r->project?->title ?? '',
            ]);

        $acceptedApplications = JoinRequest::where('applicant_id', $user->id)
            ->where('status', JoinRequestStatus::Accepted->value)
            ->with(['project:id,title'])
            ->latest('decided_at')
            ->take(5)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'project_id' => $r->project_id,
                'project_title' => $r->project?->title ?? '',
                'can_view_contact' => true,
            ]);

        $today = now(config('app.timezone', 'Africa/Addis_Ababa'))->startOfDay();
        $inThreeDays = (clone $today)->addDays(3)->toDateString();

        $closingSoon = Project::where('owner_id', $user->id)
            ->where('status', ProjectStatus::Open->value)
            ->whereBetween('application_deadline', [$today->toDateString(), $inThreeDays])
            ->orderBy('application_deadline')
            ->take(5)
            ->get(['id', 'title', 'application_deadline'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'application_deadline' => $p->application_deadline->toDateString(),
            ]);

        $attention = [
            'requests_to_review' => $requestsToReview,
            'accepted_applications' => $acceptedApplications,
            'closing_soon' => $closingSoon,
        ];

        // 4. My Projects (latest 3)
        $myProjects = Project::where('owner_id', $user->id)
            ->withCount(['acceptedRequests as members_count'])
            ->latest('id')
            ->take(3)
            ->get(['id', 'title', 'status', 'slots_total'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'status' => $p->status instanceof ProjectStatus ? $p->status->value : $p->status,
                'members_count' => $p->members_count,
                'slots_total' => $p->slots_total,
            ]);

        // 5. Matches (up to 4 recruiting projects not mine and not applied)
        $appliedProjectIds = JoinRequest::where('applicant_id', $user->id)->pluck('project_id')->all();

        $matches = [];
        if (! empty($userSkillIds)) {
            $matches = Project::query()
                ->recruiting()
                ->where('owner_id', '!=', $user->id)
                ->whereNotIn('id', $appliedProjectIds)
                ->whereHas('skills', function ($q) use ($userSkillIds) {
                    $q->whereIn('skills.id', $userSkillIds);
                })
                ->with(['skills:id,name', 'department:id,name'])
                ->withCount([
                    'skills as matched_skills_count' => function ($q) use ($userSkillIds) {
                        $q->whereIn('skills.id', $userSkillIds);
                    },
                    'acceptedRequests as members_count',
                ])
                ->orderByDesc('matched_skills_count')
                ->latest('id')
                ->take(4)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'category' => $p->category->value,
                    'department' => $p->department?->name,
                    'slots_total' => $p->slots_total,
                    'members_count' => $p->members_count,
                    'application_deadline' => $p->application_deadline->toDateString(),
                    'matched_skills' => $p->skills->filter(fn ($s) => in_array($s->id, $userSkillIds))->pluck('name')->values()->all(),
                ]);
        }

        // 6. Profile completeness calculation
        $profileFields = [
            'name' => [! empty($user->name), 'Full Name'],
            'department_id' => [! empty($user->department_id), 'Department'],
            'year_of_study' => [! empty($user->year_of_study), 'Year of Study'],
            'bio' => [! empty($user->bio), 'Bio'],
            'telegram_handle' => [! empty($user->telegram_handle), 'Telegram Username'],
            'skills' => [count($userSkillIds) > 0, 'Skills'],
        ];

        $completedCount = 0;
        $missing = [];
        foreach ($profileFields as [$isSet, $label]) {
            if ($isSet) {
                $completedCount++;
            } else {
                $missing[] = $label;
            }
        }

        $profilePercent = (int) round(($completedCount / count($profileFields)) * 100);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'attention' => $attention,
            'my_projects' => $myProjects,
            'matches' => $matches,
            'profile' => [
                'percent' => $profilePercent,
                'missing' => $missing,
            ],
            'pendingCredits' => $pendingCredits,
        ]);
    }
}