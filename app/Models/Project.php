<?php

namespace App\Models;

use App\Enums\ProjectCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     * Note: owner_id and status are intentionally excluded.
     */
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

    /**
     * The attributes that should be hidden for serialization.
     * Protects personal contact info from leaking in Inertia props.
     */
    protected $hidden = [
        'telegram_contact',
    ];

    protected function casts(): array
    {
        return [
            'category' => ProjectCategory::class,
            'application_deadline' => 'date',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Scope a query to only include currently recruiting projects.
     * Enforces active status and deadline on or after today (Addis Ababa time).
     */
    public function scopeRecruiting(Builder $query): Builder
    {
        return $query
            ->where('status', 'open')
            ->whereDate('application_deadline', '>=', today()->toDateString());
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
}