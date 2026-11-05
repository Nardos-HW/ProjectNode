<?php

namespace App\Http\Resources;

use App\Enums\ProjectStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ConversationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $currentUser = $request->user();
        $counterpart = $currentUser ? $this->counterpartFor($currentUser) : null;
        $project = $this->project;
        $statusValue = $project?->status instanceof ProjectStatus ? $project->status->value : (string) $project?->status;

        return [
            'id' => $this->id,
            'project' => [
                'id' => $project?->id,
                'title' => $project?->title,
                'status' => $statusValue,
            ],
            'counterpart' => [
                'id' => $counterpart?->id,
                'name' => $counterpart?->name,
            ],
            'can_send' => $this->canSend(),
            'last_message' => $this->lastMessage ? Str::limit($this->lastMessage->body, 80) : null,
            'last_message_at' => $this->lastMessage?->created_at?->toISOString(),
            'unread_count' => (int) ($this->unread_count ?? 0),
        ];
    }
}
