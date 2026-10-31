<?php

namespace App\Http\Controllers;

use App\Http\Resources\StudentResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display a peer student's public university profile.
     */
    public function show(User $user, Request $request): Response
    {
        $user->load(['department:id,name', 'skills:id,name']);

        return Inertia::render('Students/Show', [
            'student' => (new StudentResource($user))->resolve(),
        ]);
    }
}