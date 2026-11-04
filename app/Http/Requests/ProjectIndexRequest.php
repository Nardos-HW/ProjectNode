<?php

namespace App\Http\Requests;

use App\Enums\ProjectCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class ProjectIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', new Enum(ProjectCategory::class)],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'skills' => ['nullable', 'array', 'max:5'],
            'skills.*' => ['integer', 'distinct', 'exists:skills,id'],
            'deadline_within' => ['nullable', 'integer', 'in:7,14,30'],
            'posted' => ['nullable', 'integer', 'in:7,30'],
            'include_closed' => ['nullable', 'boolean'],
            'sort' => ['nullable', 'string', 'in:newest,deadline'],
        ];
    }
}