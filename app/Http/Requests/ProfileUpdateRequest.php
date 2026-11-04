<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('telegram_handle')) {
            $this->merge([
                'telegram_handle' => ltrim(trim((string) $this->telegram_handle), '@'),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:100'],
            'department_id'   => ['required', 'exists:departments,id'],
            'year_of_study'   => ['required', 'integer', 'between:1,7'],
            'bio'             => ['required', 'string', 'min:20', 'max:500'],
            'interests'       => ['nullable', 'string', 'max:255'],
            'telegram_handle' => ['required', 'regex:/^[A-Za-z][A-Za-z0-9_]{4,31}$/'],
            'skill_ids'       => ['nullable', 'array', 'max:15'],
            'skill_ids.*'     => ['integer', 'distinct', 'exists:skills,id'],
            'new_skills'      => ['nullable', 'array', 'max:3'],
            'new_skills.*'    => ['string', 'min:2', 'max:40', 'regex:' . \App\Support\SkillResolver::SKILL_NAME_REGEX],
        ];
    }
}