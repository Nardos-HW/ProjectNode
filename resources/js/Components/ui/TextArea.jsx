import { useId } from 'react';

export default function TextArea({
    label,
    error,
    hint,
    id,
    maxLength,
    value = '',
    rows = 4,
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

    let counterColor = 'text-neutral-500 font-mono';
    if (ratio >= 1) counterColor = 'text-red-400 font-mono font-medium';
    else if (ratio >= 0.9) counterColor = 'text-amber-400 font-mono font-medium';

    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex justify-between items-center text-xs">
                {label && (
                    <label htmlFor={inputId} className="font-medium text-neutral-200 uppercase tracking-wider text-[11px]">
                        {label} {required && <span className="text-flame-500">*</span>}
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

            <textarea
                id={inputId}
                rows={rows}
                value={value}
                maxLength={maxLength}
                required={required}
                onChange={onChange}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    error ? errorId : hint ? hintId : undefined
                }
                className={`w-full rounded-lg bg-carbon-950 border px-3.5 py-2.5 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-flame-500 focus:ring-1 focus:ring-flame-500 transition-colors resize-y ${
                    error ? 'border-red-500/80 focus:ring-red-500' : 'border-carbon-800'
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