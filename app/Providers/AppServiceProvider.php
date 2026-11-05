<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        RateLimiter::for('chat-send', function (Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('chat-poll', function (Request $request) {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            $expireMinutes = config('auth.verification.expire', 60);

            return (new MailMessage)
                ->subject('Verify your ProjectNode email')
                ->greeting("Hello {$notifiable->name},")
                ->line("Please click the button below to verify your email address. This verification link will expire in {$expireMinutes} minutes.")
                ->action('Verify email address', $url)
                ->line('If you did not register for a ProjectNode account, no further action is required.');
        });
    }
}
