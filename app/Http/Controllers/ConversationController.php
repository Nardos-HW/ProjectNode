<?php

namespace App\Http\Controllers;

use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ConversationController extends Controller
{
    /**
     * Display a list of conversations for the authenticated user.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $conversations = Conversation::forUser($user)
            ->whereHas('project')
            ->with([
                'project:id,title,status',
                'owner:id,name',
                'member:id,name',
                'lastMessage',
            ])
            ->withCount([
                'messages as unread_count' => function ($q) use ($user) {
                    $q->where('sender_id', '!=', $user->id)->whereNull('read_at');
                },
            ])
            ->get()
            ->sortByDesc(function ($conv) {
                return $conv->lastMessage?->created_at ?? $conv->created_at;
            })
            ->values();

        return Inertia::render('Messages/Index', [
            'conversations' => ConversationResource::collection($conversations)->resolve(),
        ]);
    }

    /**
     * Get the total unread messages count for the authenticated user.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = Message::whereHas('conversation', function ($q) use ($user) {
            $q->forUser($user)->whereHas('project');
        })->where('sender_id', '!=', $user->id)
          ->whereNull('read_at')
          ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Display a single conversation page.
     */
    public function show(Conversation $conversation, Request $request): Response
    {
        $project = $conversation->project()->withTrashed()->first();
        if (! $project || $project->trashed()) {
            abort(404);
        }

        Gate::authorize('view', $conversation);

        $user = $request->user();

        // Mark incoming messages as read
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        // Fetch latest 50 messages
        $messages = $conversation->messages()
            ->latest('id')
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        $oldestLoadedId = $messages->first()?->id ?? 0;
        $hasEarlier = $conversation->messages()->where('id', '<', $oldestLoadedId)->exists();

        $readUpTo = $conversation->messages()
            ->where('sender_id', $user->id)
            ->whereNotNull('read_at')
            ->max('id');

        return Inertia::render('Messages/Show', [
            'conversation' => (new ConversationResource($conversation))->resolve(),
            'messages' => MessageResource::collection($messages)->resolve(),
            'has_earlier_messages' => $hasEarlier,
            'read_up_to' => $readUpTo,
        ]);
    }

    /**
     * Poll for new messages after a specific message ID.
     */
    public function poll(Conversation $conversation, Request $request): JsonResponse
    {
        $project = $conversation->project()->withTrashed()->first();
        if (! $project || $project->trashed()) {
            abort(404);
        }

        Gate::authorize('view', $conversation);

        $user = $request->user();
        $after = (int) $request->query('after', 0);

        $newMessages = $conversation->messages()
            ->where('id', '>', $after)
            ->orderBy('id', 'asc')
            ->get();

        // Mark returned counterpart messages as read
        $counterpartMessageIds = $newMessages->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->pluck('id');

        if ($counterpartMessageIds->isNotEmpty()) {
            Message::whereIn('id', $counterpartMessageIds)->update(['read_at' => now()]);
        }

        $readUpTo = $conversation->messages()
            ->where('sender_id', $user->id)
            ->whereNotNull('read_at')
            ->max('id');

        return response()->json([
            'messages' => MessageResource::collection($newMessages),
            'can_send' => $conversation->canSend(),
            'read_up_to' => $readUpTo,
        ]);
    }

    /**
     * Load earlier messages older than a specific message ID.
     */
    public function history(Conversation $conversation, Request $request): JsonResponse
    {
        $project = $conversation->project()->withTrashed()->first();
        if (! $project || $project->trashed()) {
            abort(404);
        }

        Gate::authorize('view', $conversation);

        $before = (int) $request->query('before', 0);

        $messages = $conversation->messages()
            ->where('id', '<', $before)
            ->latest('id')
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        $oldestLoadedId = $messages->first()?->id ?? 0;
        $hasEarlier = $conversation->messages()->where('id', '<', $oldestLoadedId)->exists();

        return response()->json([
            'messages' => MessageResource::collection($messages),
            'has_earlier_messages' => $hasEarlier,
        ]);
    }
}
