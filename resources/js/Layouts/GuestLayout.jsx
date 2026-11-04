import { Link } from '@inertiajs/react';
import { ConstellationGraphic } from '@/Components/ui/EmptyState';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-ink text-text flex flex-col justify-center items-center px-4 py-8 selection:bg-violet selection:text-white relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center mb-6 z-10">
                <Link href={route('home')} className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-2xl bg-violet/20 border border-violet/40 flex items-center justify-center group-hover:border-violet transition-colors shadow-lg shadow-violet/20">
                        <span className="text-violet font-bold font-display text-base">PN</span>
                    </div>
                    <span className="font-display font-bold text-2xl text-text tracking-tight group-hover:text-violet transition-colors">
                        ProjectNode
                    </span>
                </Link>
                <div className="mt-3">
                    <ConstellationGraphic className="w-16 h-16 text-violet/20" />
                </div>
            </div>

            <div className="w-full sm:max-w-md bg-surface border border-surface-2 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 z-10">
                {children}
            </div>
        </div>
    );
}