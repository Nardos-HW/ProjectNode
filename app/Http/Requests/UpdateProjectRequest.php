<?php

namespace App\Http\Requests;

use App\Enums\ProjectCategory;
use App\Support\SkillResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        $project = $this->route('project');

        return $project && $this->user()?->can('update', $project);
    }

    public function rules(): array
    {
        $project = $this->route('project');
        $acceptedCount = $project ? $project->acceptedRequests()->count() : 0;
        $minSlots = max(1, $acceptedCount);

        return [
            'title' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string', 'max:5000'],
            'category' => ['required', new Enum(ProjectCategory::class)],
            'department_id' => ['required', 'exists:departments,id'],
            'slots_total' => ['required', 'integer', "between:{$minSlots},20"],
            'hours_per_week' => ['required', 'integer', 'between:1,40'],
            'duration_weeks' => ['required', 'integer', 'between:1,52'],
            'application_deadline' => [
                'required',
                'date',
                'after_or_equal:today',
                'before_or_equal:' . now()->addDays(180)->toDateString(),
            ],
            'telegram_contact' => ['required', 'regex:/^[A-Za-z][A-Za-z0-9_]{4,31}$/'],
            'skill_ids' => ['nullable', 'array', 'max:10'],
            'skill_ids.*' => ['integer', 'distinct', 'exists:skills,id'],
            'new_skills' => ['nullable', 'array', 'max:3'],
            'new_skills.*' => ['string', 'min:2', 'max:40', 'regex:' . SkillResolver::SKILL_NAME_REGEX],
        ];
    }

    public function messages(): array
    {
        $project = $this->route('project');
        $acceptedCount = $project ? $project->acceptedRequests()->count() : 0;

        return [
            'slots_total.between' => "Total openings cannot be less than the {$acceptedCount} already accepted collaborator(s).",
            'application_deadline.after_or_equal' => 'The application deadline must be today or a future date.',
            'application_deadline.before_or_equal' => 'The application deadline cannot be more than 180 days in the future.',
        ];
    }
}