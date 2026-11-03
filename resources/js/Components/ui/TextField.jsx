import { useId } from 'react';

export default function TextField({
    label,
    error,
    hint,
    id,
    maxLength,
    value = '',
    type = 'text',
    className = '',
    onChange,
    required = false,
    ...props
}) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const length = typeof value === 'string' ? value.length : 0;
    const ratio = maxLength ? length / maxLength : 0;

    let counterColor = 'text-muted';
    if (ratio >= 1) counterColor = 'text-coral font-medium';
    else if (ratio >= 0.9) counterColor = 'text-amber font-medium';

    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex justify-between items-center text-sm">
                {label && (
                    <label htmlFor={inputId} className="font-medium text-text">
                        {label} {required && <span className="text-coral">*</span>}
                    </label>
                )}
                {maxLength !== undefined && (
                    <span
                        className={`text-xs ${counterColor}`}
                        aria-live="polite"
                    >
                        {length} / {maxLength}
                    </span>
                )}
            </div>

            <input
                id={inputId}
                type={type}
                value={value}
                maxLength={maxLength}
                required={required}
                onChange={onChange}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    error ? errorId : hint ? hintId : undefined
                }
                className={`w-full rounded-xl bg-surface border px-3.5 py-2.5 text-text placeholder-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent transition-colors ${error ? 'border-coral focus:ring-coral' : 'border-surface-2'
                    }`}
                {...props}
            />

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