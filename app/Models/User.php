<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department_id',
        'year_of_study',
        'bio',
        'interests',
        'telegram_handle',
        'profile_completed_at',
    ];

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'profile_completed_at' => 'datetime',
            'suspended_at' => 'datetime',
            'year_of_study' => 'integer',
        ];
    }

    public function ownedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }

    public function isProfileComplete(): bool
    {
        return $this->profile_completed_at !== null;
    }

    public function joinRequests(): HasMany
    {
        return $this->hasMany(JoinRequest::class, 'applicant_id');
    }

    public function moderationActions(): HasMany
    {
        return $this->hasMany(ModerationAction::class, 'admin_id');
    }

    public function isSuspended(): bool
    {
        return $this->suspended_at !== null;
    }

    public function participations(): HasMany
    {
        return $this->hasMany(ProjectParticipant::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'owner_id');
    }
}
