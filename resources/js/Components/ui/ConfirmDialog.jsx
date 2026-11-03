import Modal from '@/Components/Modal';
import Button from './Button';

export default function ConfirmDialog({
    show = false,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    content,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    loading = false,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="bg-surface border border-surface-2 p-6 rounded-2xl">
                <h3 className="text-lg font-bold font-display text-text mb-2">
                    {title}
                </h3>
                <div className="text-sm text-muted mb-6 leading-relaxed">
                    {content}
                </div>
                <div className="flex items-center justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={danger ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}