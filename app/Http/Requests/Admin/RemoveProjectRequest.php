<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class RemoveProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'min:10', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'A formal removal reason is required.',
            'reason.min' => 'The removal reason must be at least 10 characters.',
            'reason.max' => 'The removal reason cannot exceed 500 characters.',
        ];
    }
}
