<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    /**
     * Store a newly created message in a conversation.
     */
    public function store(StoreMessageRequest $request, Conversation $conversation): JsonResponse
    {
        $project = $conversation->project()->withTrashed()->first();
        if (! $project || $project->trashed()) {
            abort(404);
        }

        // sender_id is always $request->user()->id, set in code, never from input
        $message = $conversation->messages()->create([
            'sender_id' => $request->user()->id,
            'body' => $request->validated('body'),
        ]);

        return (new MessageResource($message))
            ->response()
            ->setStatusCode(201);
    }
}
