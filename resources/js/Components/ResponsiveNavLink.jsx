import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition duration-150 ease-in-out focus:outline-none ${
                active
                    ? 'bg-neutral-100 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-medium'
            } ${className}`}
        >
            {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />}
            {children}
        </Link>
    );
}
