<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AllowedUniversityEmail implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $at = strrchr((string) $value, '@');          
        $domain = $at === false ? '' : strtolower(substr($at, 1));

        if (! in_array($domain, config('projectnode.allowed_email_domains'), true)) {
            $fail('Please register with your university email ('
                . implode(', ', config('projectnode.allowed_email_domains')) . ').');
        }
    }
}