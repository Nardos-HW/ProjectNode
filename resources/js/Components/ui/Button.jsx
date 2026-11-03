import { Link } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

export default function Button({
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    href,
    className = '',
    children,
    ...props
}) {
    const baseClasses =
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet focus:ring-offset-2 focus:ring-offset-ink disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-violet text-text hover:brightness-110 active:brightness-95 shadow-md shadow-violet/20',
        secondary: 'bg-surface-2 text-text hover:bg-surface-2/80 active:bg-surface-2/90 border border-surface-2',
        ghost: 'bg-transparent text-muted hover:text-text hover:bg-surface/60',
        danger: 'bg-coral text-ink font-semibold hover:brightness-110 active:brightness-95 shadow-md shadow-coral/20',
    };

    const sizes = {
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-sm px-4 py-2 gap-2',
        lg: 'text-base px-5 py-2.5 gap-2.5',
    };

    const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

    if (href && !disabled && !loading) {
        return (
            <Link href={href} className={combinedClasses} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={combinedClasses}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
            {children}
        </button>
    );
}