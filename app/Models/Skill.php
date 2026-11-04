<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Str;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'name_key',
        'is_custom',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_custom' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Skill $skill) {
            if (empty($skill->name_key) && ! empty($skill->name)) {
                $skill->name_key = self::normalizeKey($skill->name);
            }
        });
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public static function normalizeKey(string $name): string
    {
        return mb_strtolower(preg_replace('/\s+/', '', trim($name)));
    }

    public static function findOrCreateByName(string $name, User $by): self
    {
        $trimmedName = preg_replace('/\s+/', ' ', trim($name));
        $nameKey = self::normalizeKey($trimmedName);

        $existing = self::where('name_key', $nameKey)->first();
        if ($existing) {
            return $existing;
        }

        $baseSlug = Str::slug($trimmedName);
        if (empty($baseSlug)) {
            $baseSlug = 'skill';
        }

        $slug = $baseSlug;
        $counter = 1;
        while (self::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        try {
            return self::create([
                'name' => $trimmedName,
                'slug' => $slug,
                'name_key' => $nameKey,
                'is_custom' => true,
                'created_by' => $by->id,
            ]);
        } catch (UniqueConstraintViolationException) {
            return self::where('name_key', $nameKey)->firstOrFail();
        }
    }
}