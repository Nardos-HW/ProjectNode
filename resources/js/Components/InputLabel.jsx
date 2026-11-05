export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-[11px] font-medium uppercase tracking-wider text-neutral-300 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}

