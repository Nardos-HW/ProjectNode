<?php

namespace App\Models;

use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'category',
        'department_id',
        'slots_total',
        'hours_per_week',
        'duration_weeks',
        'application_deadline',
        'telegram_contact',
    ];

    protected $hidden = [
        'telegram_contact',
    ];

    protected function casts(): array
    {
        return [
            'category' => ProjectCategory::class,
            'status' => ProjectStatus::class,
            'application_deadline' => 'date',
            'completed_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }

    public function joinRequests(): HasMany
    {
        return $this->hasMany(JoinRequest::class);
    }

    public function acceptedRequests(): HasMany
    {
        return $this->hasMany(JoinRequest::class)->where('status', \App\Enums\JoinRequestStatus::Accepted);
    }

    public function scopeRecruiting(Builder $query): Builder
    {
        return $query->where('status', ProjectStatus::Open->value)
            ->whereDate('application_deadline', '>=', now(config('app.timezone', 'Africa/Addis_Ababa'))->toDateString())
            ->whereRaw('(SELECT COUNT(*) FROM join_requests WHERE join_requests.project_id = projects.id AND join_requests.status = ?) < projects.slots_total', [\App\Enums\JoinRequestStatus::Accepted->value]);
    }

    public function isRecruiting(): bool
    {
        $statusVal = $this->status instanceof ProjectStatus ? $this->status->value : $this->status;

        if ($statusVal !== ProjectStatus::Open->value) {
            return false;
        }

        if ($this->application_deadline->lt(now(config('app.timezone', 'Africa/Addis_Ababa'))->startOfDay())) {
            return false;
        }

        return $this->acceptedRequests()->count() < $this->slots_total;
    }

    public function canBeEdited(): bool
    {
        $statusVal = $this->status instanceof ProjectStatus ? $this->status : ProjectStatus::from($this->status);
        return ! $statusVal->isTerminal();
    }

    public function canBeDeleted(): bool
    {
        $statusVal = $this->status instanceof ProjectStatus ? $this->status : ProjectStatus::from($this->status);
        if ($statusVal === ProjectStatus::Completed) {
            return false;
        }

        return $this->acceptedRequests()->count() === 0;
    }
}