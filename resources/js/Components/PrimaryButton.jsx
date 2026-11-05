export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-flame-500/60 bg-flame-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm shadow-flame-500/20 transition duration-150 ease-in-out hover:bg-flame-600 focus:bg-flame-600 focus:outline-none focus:ring-2 focus:ring-flame-500 focus:ring-offset-2 focus:ring-offset-carbon-950 active:bg-flame-700 disabled:opacity-40 disabled:cursor-not-allowed ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

