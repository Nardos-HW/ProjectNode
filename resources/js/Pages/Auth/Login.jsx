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
            <Head title="Log in - ProjectNode" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold font-display text-neutral-900 tracking-tight">Welcome back</h1>
                <p className="text-sm text-neutral-500 mt-1">Sign in to collaborate on AAU projects</p>
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

                <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-neutral-600 select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span>Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <Button type="submit" variant="primary" size="lg" className="w-full" loading={processing}>
                        Sign In
                    </Button>
                </div>

                <p className="text-center text-xs text-neutral-500 pt-3">
                    Don't have an account yet?{' '}
                    <Link href={route('register')} className="text-blue-600 hover:underline font-semibold">
                        Register with AAU email
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
