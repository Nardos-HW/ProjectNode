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
            className={`flex w-full items-center gap-2 border-l-2 py-2 pe-4 ps-3 text-xs font-semibold uppercase tracking-wider transition duration-150 ease-in-out focus:outline-none ${
                active
                    ? 'border-flame-500 bg-carbon-900 text-white'
                    : 'border-transparent text-neutral-400 hover:border-neutral-700 hover:bg-carbon-900/60 hover:text-white'
            } ${className}`}
        >
            {active && <span className="w-1.5 h-1.5 rounded-full bg-flame-500 inline-block shadow-sm shadow-flame-500/50" />}
            {children}
        </Link>
    );
}

