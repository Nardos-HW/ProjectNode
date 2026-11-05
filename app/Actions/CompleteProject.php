<?php

namespace App\Actions;

use App\Enums\ProjectStatus;
use App\Exceptions\WorkflowException;
use App\Models\Project;
use Illuminate\Support\Facades\DB;

class CompleteProject
{
    /**
     * Execute the completion workflow atomically.
     *
     * @throws WorkflowException
     */
    public function execute(Project $project, array $data, array $creditedUserIds): void
    {
        DB::transaction(function () use ($project, $data, $creditedUserIds) {
            $p = Project::whereKey($project->id)->lockForUpdate()->firstOrFail();

            // Idempotent: second submission does nothing
            if ($p->status === ProjectStatus::Completed) {
                return;
            }

            if ($p->status === ProjectStatus::Cancelled) {
                throw new WorkflowException('A cancelled project cannot be completed.');
            }

            $p->forceFill([
                'status' => ProjectStatus::Completed->value,
                'completed_at' => now(),
                'outcome_summary' => $data['outcome_summary'],
                'outcome_url' => $data['outcome_url'] ?? null,
            ])->save();

            // Owner is automatically recorded and confirmed
            $p->participants()->where('role', 'owner')->update([
                'credited_at' => now(),
                'confirmed_at' => now(),
            ]);

            // Only explicitly selected accepted members receive credits
            if (! empty($creditedUserIds)) {
                $p->participants()->where('role', 'member')
                    ->whereIn('user_id', $creditedUserIds)
                    ->update([
                        'credited_at' => now(),
                    ]);
            }
        });
    }
}
