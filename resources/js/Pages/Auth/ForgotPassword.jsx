import GuestLayout from '@/Layouts/GuestLayout';
import TextField from '@/Components/ui/TextField';
import Button from '@/Components/ui/Button';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-xs text-muted leading-relaxed">
                Forgot your password? Enter your university email address and we will email you a password reset link.
            </div>

            {status && (
                <div className="mb-4 text-xs font-medium text-mint bg-mint/10 border border-mint/20 p-3 rounded-xl">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <TextField
                    label="University Email"
                    id="email"
                    type="email"
                    required
                    autoFocus
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <Button type="submit" variant="primary" className="w-full" loading={processing}>
                    Email Password Reset Link
                </Button>
            </form>
        </GuestLayout>
    );
}