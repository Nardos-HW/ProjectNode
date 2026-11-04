import { motion } from 'motion/react';

export default function SlotDots({ filled = 0, total = 1, className = '' }) {
    const safeTotal = Math.max(1, total);
    const safeFilled = Math.min(Math.max(0, filled), safeTotal);

    return (
        <div
            className={`inline-flex items-center gap-1.5 ${className}`}
            title={`${safeFilled} of ${safeTotal} slots filled`}
            aria-label={`${safeFilled} of ${safeTotal} openings filled`}
        >
            {Array.from({ length: safeTotal }).map((_, index) => {
                const isFilled = index < safeFilled;
                return (
                    <motion.span
                        key={index}
                        initial={false}
                        animate={{
                            scale: isFilled ? [1, 1.25, 1] : 1,
                        }}
                        transition={{ duration: 0.25 }}
                        className={`inline-block w-2.5 h-2.5 rounded-full border transition-colors ${isFilled
                                ? 'bg-violet border-violet shadow-sm shadow-violet/50'
                                : 'bg-transparent border-muted/50'
                            }`}
                    />
                );
            })}
        </div>
    );
}