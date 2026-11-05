<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendMailTest extends Command
{
    protected $signature = 'projectnode:mail-test {email}';

    protected $description = 'Send a test email to verify SMTP configuration';

    public function handle(): int
    {
        $recipient = $this->argument('email');
        $this->info("Sending test email to {$recipient} via ".config('mail.default').'...');

        try {
            Mail::raw('This is a test email confirming your ProjectNode SMTP configuration works.', function ($message) use ($recipient) {
                $message->to($recipient)
                    ->subject('ProjectNode Mailer Test');
            });

            $this->info('Email dispatched successfully! Check your inbox or spam folder.');

            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Failed to send mail: '.$e->getMessage());

            return Command::FAILURE;
        }
    }
}
