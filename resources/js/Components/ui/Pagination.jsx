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
                            className="px-3.5 py-2 text-xs rounded-lg text-muted/40 cursor-not-allowed select-none border border-transparent"
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
                        className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors border ${link.active
                                ? 'bg-violet text-text border-violet shadow-sm shadow-violet/30'
                                : 'bg-surface text-muted hover:text-text hover:bg-surface-2 border-surface-2'
                            }`}
                        dangerouslySetInnerHTML={{ __html: isCleanLabel }}
                    />
                );
            })}
        </nav>
    );
}