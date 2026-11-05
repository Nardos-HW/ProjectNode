<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $conversation = $this->route('conversation');

        if (! $conversation) {
            return false;
        }

        $project = $conversation->project()->withTrashed()->first();
        if (! $project || $project->trashed()) {
            abort(404);
        }

        return $this->user()->can('view', $conversation);
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('body')) {
            $this->merge([
                'body' => trim((string) $this->body),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body' => [
                'required',
                'string',
                'min:1',
                'max:2000',
            ],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  Validator  $validator
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $conversation = $this->route('conversation');

            if ($conversation && ! $conversation->canSend()) {
                $validator->errors()->add('body', 'This project was cancelled. Messaging is closed.');
            }
        });
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'body.required' => 'Message body cannot be empty.',
            'body.min' => 'Message body cannot be empty.',
            'body.max' => 'Message cannot exceed 2000 characters.',
        ];
    }
}
