<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'department' => $this->department?->name ?? 'General Campus',
            'year_of_study' => $this->year_of_study,
            'bio' => $this->bio,
            'interests' => $this->interests,
            'skills' => $this->relationLoaded('skills')
                ? $this->skills->map(fn ($s) => ['id' => $s->id, 'name' => $s->name])
                : $this->skills()->get(['skills.id', 'skills.name']),
        ];
    }
}