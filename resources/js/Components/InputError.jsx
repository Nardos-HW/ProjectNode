export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-xs font-mono text-red-400 mt-1 ' + className}
        >
            {message}
        </p>
    ) : null;
}

