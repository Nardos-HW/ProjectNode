<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Department;
use App\Models\Skill;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load(['skills:id,name', 'department:id,name']);

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'skills' => Skill::orderBy('name')->get(['id', 'name']),
            'userSkills' => $user->skills->pluck('id')->all(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $finalSkillIds = \App\Support\SkillResolver::resolve(
            $request->validated('skill_ids', []),
            $request->validated('new_skills', []),
            $user,
            15
        );

        $user->fill($request->safe()->except(['skill_ids', 'new_skills']));
        $user->profile_completed_at = $user->profile_completed_at ?? now();
        $user->save();

        $user->skills()->sync($finalSkillIds);

        return Redirect::route('profile.edit')->with('success', 'Profile saved.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}