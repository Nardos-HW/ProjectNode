import { Link } from '@inertiajs/react';

export default function Pagination({ links = [], className = '' }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav
            aria-label="Pagination Navigation"
            className={`flex items-center justify-center gap-1 ${className}`}
        >
            {links.map((link, idx) => {
                const isCleanLabel = link.label
                    .replace('&laquo;', '‹')
                    .replace('&raquo;', '›');

                if (!link.url) {
                    return (
                        <span
                            key={idx}
                            aria-disabled="true"
                            className="px-3.5 py-2 text-xs font-mono rounded-lg text-neutral-400 cursor-not-allowed select-none border border-transparent"
                            dangerouslySetInnerHTML={{ __html: isCleanLabel }}
                        />
                    );
                }

                return (
                    <Link
                        key={idx}
                        href={link.url}
                        preserveScroll
                        aria-current={link.active ? 'page' : undefined}
                        className={`px-3.5 py-2 text-xs font-mono font-medium rounded-lg transition-colors border ${
                            link.active
                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                                : 'bg-white text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 border-neutral-200'
                        }`}
                        dangerouslySetInnerHTML={{ __html: isCleanLabel }}
                    />
                );
            })}
        </nav>
    );
}
