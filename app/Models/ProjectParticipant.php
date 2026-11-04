<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'user_id',
        'role',
        'join_request_id',
        'credited_at',
        'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'credited_at' => 'datetime',
            'confirmed_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function joinRequest(): BelongsTo
    {
        return $this->belongsTo(JoinRequest::class);
    }

    public function isConfirmed(): bool
    {
        return $this->confirmed_at !== null;
    }

    public function isCredited(): bool
    {
        return $this->credited_at !== null;
    }
}