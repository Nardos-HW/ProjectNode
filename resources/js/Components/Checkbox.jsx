export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-carbon-700 bg-carbon-900 text-flame-500 shadow-sm focus:ring-flame-500 focus:ring-offset-carbon-950 ' +
                className
            }
        />
    );
}

