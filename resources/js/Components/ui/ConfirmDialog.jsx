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
            <div className="bg-carbon-900 border border-carbon-800 p-6 rounded-xl">
                <h3 className="text-lg font-bold font-display text-white mb-2">
                    {title}
                </h3>
                <div className="text-sm text-neutral-400 mb-6 leading-relaxed">
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