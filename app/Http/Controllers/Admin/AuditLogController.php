<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ModerationAction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $action = $request->input('action');
        $targetType = $request->input('target_type');
        $adminId = $request->input('admin_id');

        $actions = ModerationAction::query()
            ->with(['admin:id,name,email'])
            ->when($action, fn ($q, $a) => $q->where('action', $a))
            ->when($targetType, fn ($q, $t) => $q->where('target_type', $t))
            ->when($adminId, fn ($q, $adm) => $q->where('admin_id', $adminId))
            ->latest('id')
            ->paginate(20)
            ->through(function ($log) {
                $target = $log->target;
                $targetLabel = match ($log->target_type) {
                    'user' => $target ? "{$target->name} ({$target->email})" : "Deleted User #{$log->target_id}",
                    'project' => $target ? $target->title : "Deleted Project #{$log->target_id}",
                    default => "#{$log->target_id}",
                };

                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'target_type' => $log->target_type,
                    'target_id' => $log->target_id,
                    'target_label' => $targetLabel,
                    'reason' => $log->reason,
                    'created_at' => $log->created_at->format('M d, Y H:i:s'),
                    'admin' => [
                        'id' => $log->admin->id,
                        'name' => $log->admin->name,
                        'email' => $log->admin->email,
                    ],
                ];
            })
            ->withQueryString();

        $admins = User::where('role', 'admin')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/AuditLogs/Index', [
            'actions' => $actions,
            'filters' => [
                'action' => $action,
                'target_type' => $targetType,
                'admin_id' => $adminId,
            ],
            'admins' => $admins,
        ]);
    }
}
