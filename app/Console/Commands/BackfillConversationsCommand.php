<?php

namespace App\Console\Commands;

use App\Enums\JoinRequestStatus;
use App\Models\Conversation;
use App\Models\JoinRequest;
use Illuminate\Console\Command;

class BackfillConversationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'projectnode:backfill-conversations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backfill conversations for accepted join requests that do not have one.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $acceptedRequests = JoinRequest::where('status', JoinRequestStatus::Accepted)
            ->with('project')
            ->get();

        $createdCount = 0;

        foreach ($acceptedRequests as $req) {
            if (! $req->project) {
                continue;
            }

            $conversation = Conversation::firstOrCreate(
                ['join_request_id' => $req->id],
                [
                    'project_id' => $req->project_id,
                    'owner_id' => $req->project->owner_id,
                    'member_id' => $req->applicant_id,
                ]
            );

            if ($conversation->wasRecentlyCreated) {
                $createdCount++;
            }
        }

        $this->info("Backfilled {$createdCount} conversations for accepted join requests.");

        return self::SUCCESS;
    }
}
