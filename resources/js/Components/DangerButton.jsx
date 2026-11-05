export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-red-800/80 bg-red-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-300 shadow-sm transition duration-150 ease-in-out hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-carbon-950 active:bg-red-950 disabled:opacity-40 disabled:cursor-not-allowed ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

