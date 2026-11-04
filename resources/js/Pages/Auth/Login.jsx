import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import TextField from '@/Components/ui/TextField';
import Button from '@/Components/ui/Button';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-6">
                <h1 className="text-xl font-bold font-display text-text">Welcome back</h1>
                <p className="text-xs text-muted mt-1">Sign in with your university account</p>
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
                    placeholder="student@aau.edu.et"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <TextField
                    label="Password"
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-muted select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-surface-2 text-violet focus:ring-violet bg-ink"
                        />
                        <span>Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-muted hover:text-text hover:underline"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <Button type="submit" variant="primary" className="w-full" loading={processing}>
                        Log in
                    </Button>
                </div>

                <p className="text-center text-xs text-muted pt-2">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="text-violet hover:underline font-medium">
                        Register here
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}