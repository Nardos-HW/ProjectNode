<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModerationAction extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'admin_id',
        'action',
        'target_type',
        'target_id',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Resolve the polymorphic moderation target including soft-deleted entities.
     */
    public function getTargetAttribute(): ?Model
    {
        return match ($this->target_type) {
            'user' => User::find($this->target_id),
            'project' => Project::withTrashed()->find($this->target_id),
            default => null,
        };
    }
}
