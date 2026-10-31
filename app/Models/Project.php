<?php

namespace App\Models;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

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
            'application_deadline' => 'date',
            'slots_total' => 'integer',
            'hours_per_week' => 'integer',
            'duration_weeks' => 'integer',
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
        return $this->hasMany(JoinRequest::class)->where('status', JoinRequestStatus::Accepted);
    }

    /**
     * Scope a query to only include active recruiting projects with available openings.
     */
    public function scopeRecruiting(Builder $query): Builder
    {
        return $query
            ->where('status', 'open')
            ->whereDate('application_deadline', '>=', today()->toDateString())
            ->whereRaw(
                '(select count(*) from join_requests jr
                  where jr.project_id = projects.id and jr.status = ?) < projects.slots_total',
                [JoinRequestStatus::Accepted->value]
            );
    }

    /**
     * Check if project is currently accepting new applications.
     */
    public function isRecruiting(): bool
    {
        return $this->status === 'open'
            && $this->application_deadline->gte(today())
            && $this->acceptedRequests()->count() < $this->slots_total;
    }
}