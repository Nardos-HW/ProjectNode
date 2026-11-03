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
                <label htmlFor={selectId} className="block text-sm font-medium text-text">
                    {label} {required && <span className="text-coral">*</span>}
                </label>
            )}

            <select
                id={selectId}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : hint ? hintId : undefined}
                className={`w-full rounded-xl bg-surface border px-3.5 py-2.5 text-text text-sm focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent transition-colors ${error ? 'border-coral focus:ring-coral' : 'border-surface-2'
                    }`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-surface text-text">
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