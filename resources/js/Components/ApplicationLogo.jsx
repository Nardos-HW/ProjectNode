export default function ApplicationLogo({ className = 'h-8 w-auto', ...props }) {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            {/* Clean, Modern Geometric Node Logo */}
            <circle cx="12" cy="12" r="5" fill="#0F172A" />
            <circle cx="28" cy="12" r="5" fill="#2563EB" />
            <circle cx="20" cy="28" r="6" fill="#0F172A" />
            <path
                d="M12 12L28 12M12 12L20 28M28 12L20 28"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="20" cy="28" r="2.5" fill="#FFFFFF" />
        </svg>
    );
}
