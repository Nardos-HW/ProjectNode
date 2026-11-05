export default function ApplicationLogo({ className = 'h-8 w-auto', ...props }) {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            {/* Industrial Structural Truss / Node Glyph */}
            <path
                d="M8 32L20 8L32 32M13 22H27M20 8V32"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Center Node Core Accent */}
            <circle cx="20" cy="22" r="2.5" fill="#FF4D00" />
            <circle cx="20" cy="8" r="1.8" fill="#FF4D00" />
            <circle cx="8" cy="32" r="1.8" fill="#FF4D00" />
            <circle cx="32" cy="32" r="1.8" fill="#FF4D00" />
        </svg>
    );
}

