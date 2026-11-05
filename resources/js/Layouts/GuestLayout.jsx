import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-carbon-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-flame-500 selection:text-white relative overflow-hidden cad-grid">
            {/* Ambient subtle flame glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-flame-500/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="flex flex-col items-center mb-8 z-10 space-y-3">
                <Link href={route('home')} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-carbon-900 border border-carbon-800 flex items-center justify-center group-hover:border-flame-500/60 transition-colors shadow-lg shadow-black/40">
                        <ApplicationLogo className="w-6 h-6 text-flame-500" />
                    </div>
                    <div className="flex items-center tracking-widest text-sm font-bold font-mono text-white">
                        <span>PROJECT</span>
                        <span className="text-flame-500">NODE</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-flame-500 ml-1 inline-block"></span>
                    </div>
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-carbon-900 border border-carbon-800 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-flame-500 animate-pulse" />
                    AAU Technical Network
                </div>
            </div>

            <div className="w-full sm:max-w-md bg-carbon-900 border border-carbon-800 rounded-xl p-6 sm:p-8 shadow-2xl shadow-black/60 z-10 relative cad-crosshairs">
                {children}
            </div>

            <div className="mt-8 text-center text-xs font-mono text-neutral-600 z-10">
                ADDIS ABABA UNIVERSITY &bull; INDUSTRIAL DARK SPEC
            </div>
        </div>
    );
}
