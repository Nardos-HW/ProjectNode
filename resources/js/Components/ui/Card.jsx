import { motion } from 'motion/react';
import { hoverLift } from '@/lib/motion';

export default function Card({
    as = 'div',
    hover = false,
    className = '',
    children,
    ...props
}) {
    const Component = hover ? motion.div : as;
    const hoverProps = hover ? { variants: hoverLift, initial: 'rest', whileHover: 'hover' } : {};

    const hoverClasses = hover
        ? 'transition-all duration-300 hover:border-neutral-700 hover:shadow-[0_-1px_15px_rgba(255,77,0,0.12)]'
        : '';

    return (
        <Component
            className={`bg-carbon-900 border border-carbon-800 rounded-xl p-6 text-neutral-100 shadow-md shadow-black/40 ${hoverClasses} ${className}`}
            {...hoverProps}
            {...props}
        >
            {children}
        </Component>
    );
}
