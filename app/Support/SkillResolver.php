<?php

namespace App\Support;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class SkillResolver
{
    public const SKILL_NAME_REGEX = '/^[\p{L}\p{N}][\p{L}\p{N} +#.\-]*$/u';

    /**
     * Resolve existing IDs and new custom names into an array of unique skill IDs.
     *
     * @param array<int> $skillIds
     * @param array<string> $newNames
     * @throws ValidationException
     */
    public static function resolve(array $skillIds, array $newNames, User $by, int $max): array
    {
        if (count($newNames) > 3) {
            throw ValidationException::withMessages([
                'new_skills' => 'You cannot propose more than 3 custom skills in a single submission.',
            ]);
        }

        $resolvedNewIds = [];

        foreach ($newNames as $name) {
            $name = trim($name);
            if (empty($name)) {
                continue;
            }

            $length = mb_strlen($name);
            if ($length < 2 || $length > 40 || ! preg_match(self::SKILL_NAME_REGEX, $name)) {
                throw ValidationException::withMessages([
                    'new_skills' => "Skill name '{$name}' contains invalid characters or does not meet the 2-40 character limit.",
                ]);
            }

            $skill = Skill::findOrCreateByName($name, $by);
            $resolvedNewIds[] = $skill->id;
        }

        $allIds = array_values(array_unique(array_merge($skillIds, $resolvedNewIds)));

        if (count($allIds) < 1) {
            throw ValidationException::withMessages([
                'skill_ids' => 'At least one skill is required.',
            ]);
        }

        if (count($allIds) > $max) {
            throw ValidationException::withMessages([
                'skill_ids' => "You cannot select more than {$max} total skills.",
            ]);
        }

        return $allIds;
    }
}