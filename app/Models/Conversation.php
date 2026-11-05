<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'join_request_id',
        'project_id',
        'owner_id',
        'member_id',
    ];

    public function joinRequest(): BelongsTo
    {
        return $this->belongsTo(JoinRequest::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function lastMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        return $query->where(function (Builder $q) use ($user) {
            $q->where('owner_id', $user->id)
                ->orWhere('member_id', $user->id);
        });
    }

    public function participates(User $user): bool
    {
        return $user->id === $this->owner_id || $user->id === $this->member_id;
    }

    public function canSend(): bool
    {
        $project = $this->relationLoaded('project')
            ? $this->project
            : $this->project()->withTrashed()->first();

        if (! $project || $project->trashed()) {
            return false;
        }

        $status = $project->status instanceof ProjectStatus ? $project->status : ProjectStatus::tryFrom((string) $project->status);

        return $status !== ProjectStatus::Cancelled;
    }

    public function counterpartFor(User $user): User
    {
        return $user->id === $this->owner_id ? $this->member : $this->owner;
    }
}
