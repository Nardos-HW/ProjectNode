<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileIsComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isProfileComplete()) {
            return redirect()->route('profile.edit')
                ->with('info', 'Please complete your university profile before posting or joining projects.');
        }

        return $next($request);
    }
}