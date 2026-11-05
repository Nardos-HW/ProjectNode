import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F0F5FF] via-canvas to-canvas text-neutral-900 flex flex-col justify-center items-center px-4 py-12 selection:bg-blue-600 selection:text-white relative">
            <div className="flex flex-col items-center mb-8 z-10 space-y-3">
                <Link href={route('home')} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105">
                        <ApplicationLogo className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center text-lg font-bold font-display tracking-tight text-neutral-900">
                        <span>Project</span>
                        <span className="text-blue-600">Node</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-1 inline-block"></span>
                    </div>
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200/80 text-xs font-medium text-neutral-600 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Addis Ababa University Student Network
                </div>
            </div>

            <div className="w-full sm:max-w-md bg-white border border-neutral-200/90 rounded-3xl p-7 sm:p-9 shadow-float z-10 relative">
                {children}
            </div>

            <div className="mt-8 text-center text-xs text-neutral-400 z-10 font-medium">
                Addis Ababa University &bull; Student Innovation & Collaboration
            </div>
        </div>
    );
}
