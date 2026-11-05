export default function FormSection({
    title,
    description,
    children,
    className = '',
}) {
    return (
        <fieldset className={`space-y-4 ${className}`}>
            {(title || description) && (
                <legend className="block w-full pb-2 mb-2 border-b border-carbon-800">
                    {title && <span className="block text-xs font-bold uppercase tracking-wider font-mono text-white">{title}</span>}
                    {description && <span className="block text-xs text-neutral-400 mt-0.5">{description}</span>}
                </legend>
            )}
            <div className="space-y-4">
                {children}
            </div>
        </fieldset>
    );
}
