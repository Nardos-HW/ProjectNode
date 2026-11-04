import GuestLayout from '@/Layouts/GuestLayout';
import TextField from '@/Components/ui/TextField';
import Button from '@/Components/ui/Button';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-4 text-xs text-muted leading-relaxed">
                This is a secure area of the application. Please confirm your password before continuing.
            </div>

            <form onSubmit={submit} className="space-y-4">
                <TextField
                    label="Password"
                    id="password"
                    type="password"
                    required
                    autoFocus
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />

                <Button type="submit" variant="primary" className="w-full" loading={processing}>
                    Confirm
                </Button>
            </form>
        </GuestLayout>
    );
}