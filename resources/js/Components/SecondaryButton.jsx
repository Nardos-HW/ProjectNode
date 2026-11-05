export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-lg border border-carbon-700 bg-carbon-850 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-200 shadow-sm transition duration-150 ease-in-out hover:bg-carbon-800 hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-flame-500/50 focus:ring-offset-2 focus:ring-offset-carbon-950 active:bg-carbon-900 disabled:opacity-40 disabled:cursor-not-allowed ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

