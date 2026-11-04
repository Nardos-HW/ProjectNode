export const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren,
            delayChildren,
        },
    },
});

export const hoverLift = {
    rest: { y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    hover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } },
};