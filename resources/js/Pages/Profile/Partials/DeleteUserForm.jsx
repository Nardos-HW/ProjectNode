import TextField from '@/Components/ui/TextField';
import Button from '@/Components/ui/Button';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e?.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold font-display text-red-600">Delete Account</h2>
                <p className="text-xs font-mono text-neutral-500 mt-1 leading-relaxed">
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                </p>
            </header>

            <Button variant="danger" size="sm" onClick={confirmUserDeletion}>
                Delete Account
            </Button>

            <ConfirmDialog
                show={confirmingUserDeletion}
                onClose={closeModal}
                title="Are you sure you want to delete your account?"
                danger
                confirmText="Delete Account"
                loading={processing}
                onConfirm={deleteUser}
                content={
                    <div className="space-y-4">
                        <p className="text-xs text-muted leading-relaxed">
                            Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.
                        </p>
                        <TextField
                            label="Password"
                            id="password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            placeholder="Password"
                        />
                    </div>
                }
            />
        </section>
    );
}