<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    /**
     * Check if the user participates in the conversation.
     */
    public function participates(User $user, Conversation $conversation): bool
    {
        return $user->id === $conversation->owner_id || $user->id === $conversation->member_id;
    }

    /**
     * Determine whether the user can view the conversation.
     */
    public function view(User $user, Conversation $conversation): bool
    {
        if (! $this->participates($user, $conversation)) {
            return false;
        }

        $project = $conversation->project()->withTrashed()->first();

        return $project && ! $project->trashed();
    }

    /**
     * Determine whether the user can send messages in the conversation.
     */
    public function send(User $user, Conversation $conversation): bool
    {
        return $this->view($user, $conversation) && $conversation->canSend();
    }
}
