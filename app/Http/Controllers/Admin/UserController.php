<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SuspendUserRequest;
use App\Models\Department;
use App\Models\ModerationAction;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $search = $request->input('search');
        $status = $request->input('status', 'all');
        $departmentId = $request->input('department_id');

        $users = User::query()
            ->with(['department:id,name', 'skills:id,name'])
            ->withCount(['ownedProjects', 'joinRequests'])
            ->when($search, function ($q, $term) {
                $term = '%'.addcslashes($term, '%_').'%';
                $q->where(function ($sub) use ($term) {
                    $sub->where('name', 'ILIKE', $term)
                        ->orWhere('email', 'ILIKE', $term);
                });
            })
            ->when($departmentId, fn ($q, $d) => $q->where('department_id', $departmentId))
            ->when($status === 'suspended', fn ($q) => $q->whereNotNull('suspended_at'))
            ->when($status === 'active', fn ($q) => $q->whereNull('suspended_at'))
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'department_id' => $departmentId,
            ],
            'departments' => Department::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function suspend(SuspendUserRequest $request, User $user): RedirectResponse
    {
        Gate::authorize('suspend', $user);

        $reason = $request->validated('reason');

        DB::transaction(function () use ($request, $user, $reason) {
            $user->forceFill([
                'suspended_at' => now(),
                'suspension_reason' => $reason,
            ])->save();

            // Invalidate active web sessions
            DB::table('sessions')->where('user_id', $user->id)->delete();

            ModerationAction::create([
                'admin_id' => $request->user()->id,
                'action' => 'user_suspended',
                'target_type' => 'user',
                'target_id' => $user->id,
                'reason' => $reason,
            ]);
        });

        return back()->with('success', "Student account {$user->name} has been suspended.");
    }

    public function unsuspend(Request $request, User $user): RedirectResponse
    {
        Gate::authorize('unsuspend', $user);

        $request->validate([
            'reason' => ['required', 'string', 'min:10', 'max:500'],
        ]);

        $reason = $request->input('reason');

        DB::transaction(function () use ($request, $user, $reason) {
            $user->forceFill([
                'suspended_at' => null,
                'suspension_reason' => null,
            ])->save();

            ModerationAction::create([
                'admin_id' => $request->user()->id,
                'action' => 'user_unsuspended',
                'target_type' => 'user',
                'target_id' => $user->id,
                'reason' => $reason,
            ]);
        });

        return back()->with('success', "Student account {$user->name} has been reinstated.");
    }
}
