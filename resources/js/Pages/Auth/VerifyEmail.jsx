import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/ui/Button';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4 text-xs font-mono text-neutral-400 leading-relaxed">
                Thanks for signing up! Before getting started, please verify your email address by clicking the link we just sent to your AAU inbox.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Button type="submit" variant="primary" className="w-full" loading={processing}>
                    Resend Verification Email
                </Button>

                <div className="text-center pt-2">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-xs text-muted hover:text-text hover:underline"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}