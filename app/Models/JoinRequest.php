<?php

namespace App\Models;

use App\Enums\JoinRequestStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JoinRequest extends Model
{
    protected $fillable = [
        'project_id',
        'applicant_id',
        'message',
        'status',
        'decided_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => JoinRequestStatus::class,
            'decided_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }

    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class);
    }
}