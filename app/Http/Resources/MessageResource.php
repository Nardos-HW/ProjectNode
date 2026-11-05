<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $currentUser = $request->user() ?? auth()->user();

        return [
            'id' => $this->id,
            'body' => $this->body,
            'sender_id' => $this->sender_id,
            'is_mine' => $currentUser ? ((int) $this->sender_id === (int) $currentUser->id) : false,
            'created_at' => $this->created_at?->toISOString(),
            'read_at' => $this->read_at !== null,
        ];
    }
}

