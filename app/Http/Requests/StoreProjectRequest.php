<?php

namespace App\Http\Requests;

use App\Enums\ProjectCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('telegram_contact')) {
            $this->merge([
                'telegram_contact' => ltrim(trim((string) $this->telegram_contact), '@'),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string', 'max:5000'],
            'category' => ['required', new \Illuminate\Validation\Rules\Enum(\App\Enums\ProjectCategory::class)],
            'department_id' => ['required', 'exists:departments,id'],
            'slots_total' => ['required', 'integer', 'between:1,20'],
            'hours_per_week' => ['required', 'integer', 'between:1,40'],
            'duration_weeks' => ['required', 'integer', 'between:1,52'],
            'application_deadline' => ['required', 'date', 'after_or_equal:today'],
            'telegram_contact' => ['required', 'regex:/^[A-Za-z][A-Za-z0-9_]{4,31}$/'],
            'skill_ids' => ['nullable', 'array', 'max:10'],
            'skill_ids.*' => ['integer', 'distinct', 'exists:skills,id'],
            'new_skills' => ['nullable', 'array', 'max:3'],
            'new_skills.*' => ['string', 'min:2', 'max:40', 'regex:' . \App\Support\SkillResolver::SKILL_NAME_REGEX],
        ];
    }
}