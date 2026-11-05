<?php

namespace App\Http\Controllers;

use App\Models\ProjectParticipant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ParticipationConfirmationController extends Controller
{
    /**
     * Confirm a pending participation credit for the authenticated student.
     */
    public function update(Request $request, ProjectParticipant $participant): RedirectResponse
    {
        // Enforce ownership: only the credited participant can confirm their own row
        if ($participant->user_id !== $request->user()->id) {
            abort(403, 'You are not authorized to confirm this credit.');
        }

        // Compare-and-set query (File 03, Section 3.7)
        $changed = ProjectParticipant::whereKey($participant->id)
            ->where('user_id', $request->user()->id)
            ->whereNotNull('credited_at')
            ->whereNull('confirmed_at')
            ->update([
                'confirmed_at' => now(),
            ]);

        if ($changed === 0) {
            return back()->withErrors([
                'message' => 'This credit is not pending confirmation or has already been confirmed.',
            ]);
        }

        return back()->with('success', 'Participation credit confirmed and added to your public profile.');
    }
}
