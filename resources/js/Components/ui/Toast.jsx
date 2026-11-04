import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        } else if (flash?.info) {
            setToast({ type: 'info', message: flash.info });
        }
    }, [flash]);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(timer);
    }, [toast]);

    if (!toast) return null;

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-mint flex-shrink-0" />,
        error: <AlertTriangle className="w-5 h-5 text-coral flex-shrink-0" />,
        info: <Info className="w-5 h-5 text-violet flex-shrink-0" />,
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full pointer-events-none">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        role="status"
                        className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-surface-2 border border-surface-2 shadow-xl shadow-black/40 text-text"
                    >
                        {icons[toast.type]}
                        <p className="text-sm flex-1 leading-snug">{toast.message}</p>
                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="text-muted hover:text-text transition-colors"
                            aria-label="Dismiss notification"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}