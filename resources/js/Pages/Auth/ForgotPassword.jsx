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
            <Head title="Forgot Password - ProjectNode" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold font-display text-neutral-900 tracking-tight">Reset password</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Enter your AAU email address and we'll send you a secure link to reset your password.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl">
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
                    placeholder="student@aau.edu.et"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <Button type="submit" variant="primary" size="lg" className="w-full" loading={processing}>
                    Send Reset Link
                </Button>
            </form>
        </GuestLayout>
    );
}
