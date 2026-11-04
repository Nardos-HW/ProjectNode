import GuestLayout from '@/Layouts/GuestLayout';
import TextField from '@/Components/ui/TextField';
import Button from '@/Components/ui/Button';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-6">
                <h1 className="text-xl font-bold font-display text-text">Create account</h1>
                <p className="text-xs text-muted mt-1">Join the Addis Ababa University project network</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <TextField
                    label="Full Name"
                    id="name"
                    required
                    autoFocus
                    placeholder="Abebe Kebede"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                />

                <TextField
                    label="University Email"
                    id="email"
                    type="email"
                    required
                    placeholder="student@aau.edu.et"
                    hint="Only official AAU email addresses (@aau.edu.et) are accepted."
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <TextField
                    label="Password"
                    id="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <TextField
                    label="Confirm Password"
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
                        Register
                    </Button>
                </div>

                <p className="text-center text-xs text-muted pt-2">
                    Already registered?{' '}
                    <Link href={route('login')} className="text-violet hover:underline font-medium">
                        Log in
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}