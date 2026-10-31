<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * Note: email and telegram_handle are intentionally excluded.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'department'    => $this->department?->name ?? 'General Campus',
            'year_of_study' => $this->year_of_study,
            'bio'           => $this->bio,
            'interests'     => $this->interests,
            'skills'        => $this->skills->map(fn ($skill) => [
                'id'   => $skill->id,
                'name' => $skill->name,
            ]),
        ];
    }
}