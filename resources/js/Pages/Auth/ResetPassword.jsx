import GuestLayout from '@/Layouts/GuestLayout';
import TextField from '@/Components/ui/TextField';
import Button from '@/Components/ui/Button';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-6">
                <h1 className="text-xl font-bold font-display uppercase tracking-wider text-neutral-950">Reset Password</h1>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <TextField
                    label="University Email"
                    id="email"
                    type="email"
                    required
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <TextField
                    label="New Password"
                    id="password"
                    type="password"
                    required
                    autoFocus
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <TextField
                    label="Confirm New Password"
                    id="password_confirmation"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                />

                <div className="pt-2">
                    <Button type="submit" variant="primary" className="w-full" loading={processing}>
                        Reset Password
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}