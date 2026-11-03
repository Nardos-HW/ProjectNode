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

    return (
        <Component
            className={`bg-surface border border-surface-2/70 rounded-2xl p-6 shadow-lg shadow-black/20 ${className}`}
            {...hoverProps}
            {...props}
        >
            {children}
        </Component>
    );
}