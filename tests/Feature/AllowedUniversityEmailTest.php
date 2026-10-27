<?php

namespace Tests\Feature;

use App\Rules\AllowedUniversityEmail;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AllowedUniversityEmailTest extends TestCase
{
    public function test_it_validates_university_emails(): void
    {
        Config::set('projectnode.allowed_email_domains', ['aau.edu.et']);

        $rule = new AllowedUniversityEmail();

        $validEmails = [
            'abebe@aau.edu.et',
            'abebe.kebede@aau.edu.et',
            'student@AAU.EDU.ET', 
        ];

        foreach ($validEmails as $email) {
            $failed = false;
            $rule->validate('email', $email, function () use (&$failed) {
                $failed = true;
            });
            $this->assertFalse($failed, "Email {$email} should be valid.");
        }

        $invalidEmails = [
            'abebe@gmail.com',
            'abebe@evilaau.edu.et',
            'abebe@aau.edu.et.attacker.com',
            'not-an-email',
        ];

        foreach ($invalidEmails as $email) {
            $failed = false;
            $rule->validate('email', $email, function () use (&$failed) {
                $failed = true;
            });
            $this->assertTrue($failed, "Email {$email} should be invalid.");
        }
    }
}