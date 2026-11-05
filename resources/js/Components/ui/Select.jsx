import { useId } from 'react';

export default function Select({
    label,
    error,
    hint,
    id,
    options = [],
    className = '',
    required = false,
    ...props
}) {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-[11px] font-medium uppercase tracking-wider text-neutral-200">
                    {label} {required && <span className="text-flame-500">*</span>}
                </label>
            )}

            <select
                id={selectId}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : hint ? hintId : undefined}
                className={`w-full rounded-lg bg-carbon-950 border px-3.5 py-2.5 text-neutral-100 text-sm focus:outline-none focus:border-flame-500 focus:ring-1 focus:ring-flame-500 transition-colors ${
                    error ? 'border-red-500/80 focus:ring-red-500' : 'border-carbon-800'
                }`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-carbon-900 text-neutral-100">
                        {opt.label}
                    </option>
                ))}
            </select>

            {hint && !error && (
                <p id={hintId} className="text-xs text-muted">
                    {hint}
                </p>
            )}

            {error && (
                <p id={errorId} className="text-xs text-coral">
                    {error}
                </p>
            )}
        </div>
    );
}