<?php

namespace App\Console\Commands;

use App\Mail\DiagnosticTestMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Throwable;

class MailTestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'projectnode:mail-test {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email through the configured mailer to verify SMTP settings.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (app()->environment('production')) {
            $this->error('This diagnostic command cannot be run in production.');

            return self::FAILURE;
        }

        $email = (string) $this->argument('email');

        $this->info("Sending test email to [{$email}]...");

        try {
            Mail::to($email)->send(new DiagnosticTestMail);

            $this->info("Success! Test email successfully sent to [{$email}].");

            return self::SUCCESS;
        } catch (Throwable $e) {
            $this->error("Failed to send test email: {$e->getMessage()}");

            return self::FAILURE;
        }
    }
}
