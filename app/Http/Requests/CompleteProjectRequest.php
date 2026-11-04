<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        $project = $this->route('project');
        return $project instanceof Project && $this->user()->can('complete', $project);
    }

    public function rules(): array
    {
        $projectId = $this->route('project')->id;

        return [
            'outcome_summary' => ['required', 'string', 'min:20', 'max:1000'],
            'outcome_url' => ['nullable', 'url', 'starts_with:https://', 'max:255'],
            'credited_user_ids' => ['present', 'array'],
            'credited_user_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('project_participants', 'user_id')->where(fn ($q) => $q
                    ->where('project_id', $projectId)
                    ->where('role', 'member')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'outcome_summary.required' => 'An outcome summary describing what was built or achieved is required.',
            'outcome_summary.min' => 'The outcome summary must be at least 20 characters.',
            'outcome_summary.max' => 'The outcome summary cannot exceed 1000 characters.',
            'outcome_url.starts_with' => 'The project evidence link must be a secure URL starting with https://',
            'credited_user_ids.*.exists' => 'Only accepted team members of this project can be credited.',
        ];
    }
}