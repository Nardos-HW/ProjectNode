<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsNotSuspended
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->isSuspended()) {
            if ($request->routeIs('suspended') || $request->routeIs('logout')) {
                return $next($request);
            }

            return redirect()->route('suspended');
        }

        return $next($request);
    }
}
