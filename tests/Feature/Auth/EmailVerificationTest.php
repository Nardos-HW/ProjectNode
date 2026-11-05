<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_verification_screen_can_be_rendered(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->get('/verify-email');

        $response->assertStatus(200);
    }

    public function test_registration_dispatches_verification_notification_to_lowercase_email(): void
    {
        Notification::fake();

        $response = $this->post('/register', [
            'name' => 'Abebe Bikila',
            'email' => 'ABEBE.BIKILA@AAU.EDU.ET',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', 'abebe.bikila@aau.edu.et')->first();
        $this->assertNotNull($user);

        Notification::assertSentTo(
            $user,
            VerifyEmail::class,
            function ($notification, $channels, $notifiable) {
                return $notifiable->email === 'abebe.bikila@aau.edu.et';
            }
        );
    }

    public function test_resend_dispatches_notification_again_for_unverified_user(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create([
            'email' => 'unverified.student@aau.edu.et',
        ]);

        $response = $this->actingAs($user)->post(route('verification.send'));

        $response->assertSessionHas('status', 'verification-link-sent');
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_resend_does_not_dispatch_notification_for_already_verified_user(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'verified.student@aau.edu.et',
        ]);

        $response = $this->actingAs($user)->post(route('verification.send'));

        $response->assertRedirect(route('dashboard', absolute: false));
        Notification::assertNotSentTo($user, VerifyEmail::class);
    }

    public function test_email_can_be_verified_and_redirects_to_profile_setup_when_profile_incomplete(): void
    {
        $user = User::factory()->unverified()->create([
            'profile_completed_at' => null,
        ]);

        Event::fake([Verified::class]);

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->actingAs($user)->get($verificationUrl);

        Event::assertDispatched(Verified::class);
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $response->assertRedirect(route('profile.edit', absolute: false).'?verified=1');
    }

    public function test_email_verification_redirects_to_projects_when_profile_complete(): void
    {
        $user = User::factory()->unverified()->create([
            'profile_completed_at' => now(),
        ]);

        Event::fake([Verified::class]);

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->actingAs($user)->get($verificationUrl);

        Event::assertDispatched(Verified::class);
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $response->assertRedirect(route('projects.index', absolute: false).'?verified=1');
    }

    public function test_email_is_not_verified_with_invalid_hash(): void
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1('wrong-email')]
        );

        $response = $this->actingAs($user)->get($verificationUrl);

        $response->assertStatus(403);
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_tampered_signed_link_returns_403_and_leaves_email_unverified(): void
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $tamperedUrl = $verificationUrl . '&extra=tampered';

        $response = $this->actingAs($user)->get($tamperedUrl);

        $response->assertStatus(403);
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_expired_signed_link_returns_403_and_leaves_email_unverified(): void
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->subMinutes(10),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->actingAs($user)->get($verificationUrl);

        $response->assertStatus(403);
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_mailer_exception_during_registration_is_caught_and_reported_while_account_created(): void
    {
        Event::listen(Registered::class, function () {
            throw new \RuntimeException('Simulated SMTP connection failure');
        });

        $response = $this->post('/register', [
            'name' => 'Tadesse Lemma',
            'email' => 'tadesse.lemma@aau.edu.et',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'tadesse.lemma@aau.edu.et',
        ]);
        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_diagnostic_mail_test_command_sends_email_in_local_environment(): void
    {
        Mail::fake();

        $this->artisan('projectnode:mail-test test@example.com')
            ->expectsOutput('Sending test email to [test@example.com]...')
            ->expectsOutput('Success! Test email successfully sent to [test@example.com].')
            ->assertSuccessful();

        Mail::assertSent(\App\Mail\DiagnosticTestMail::class, function ($mail) {
            return $mail->hasTo('test@example.com');
        });
    }

    public function test_diagnostic_mail_test_command_refuses_to_run_in_production(): void
    {
        $this->app->detectEnvironment(fn () => 'production');

        $this->artisan('projectnode:mail-test test@example.com')
            ->expectsOutput('This diagnostic command cannot be run in production.')
            ->assertFailed();
    }
}
