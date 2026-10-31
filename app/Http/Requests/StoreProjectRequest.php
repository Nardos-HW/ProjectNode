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
            'title'                => ['required', 'string', 'min:5', 'max:120'],
            'description'          => ['required', 'string', 'min:30', 'max:5000'],
            'category'             => ['required', Rule::enum(ProjectCategory::class)],
            'department_id'        => ['nullable', 'exists:departments,id'],
            'skill_ids'            => ['required', 'array', 'min:1', 'max:10'],
            'skill_ids.*'          => ['integer', 'distinct', 'exists:skills,id'],
            'slots_total'          => ['required', 'integer', 'between:1,20'],
            'hours_per_week'       => ['required', 'integer', 'between:1,40'],
            'duration_weeks'       => ['required', 'integer', 'between:1,52'],
            'application_deadline' => ['required', 'date', 'after_or_equal:today', 'before_or_equal:+180 days'],
            'telegram_contact'     => ['required', 'regex:/^[A-Za-z][A-Za-z0-9_]{4,31}$/'],
        ];
    }
}