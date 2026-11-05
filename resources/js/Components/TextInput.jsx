import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-lg border border-carbon-800 bg-carbon-950 px-3.5 py-2 text-sm text-white placeholder-neutral-600 shadow-sm transition-colors focus:border-flame-500 focus:ring-1 focus:ring-flame-500 focus:outline-none ' +
                className
            }
            ref={localRef}
        />
    );
});
