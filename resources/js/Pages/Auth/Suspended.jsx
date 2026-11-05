import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, LogOut } from 'lucide-react';

export default function Suspended({ reason, suspended_at }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-carbon-950 cad-grid selection:bg-red-500 selection:text-white">
            <Head title="Account Suspended" />

            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 mb-2">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold font-display uppercase tracking-wider text-white">Account Suspended</h1>
                    <p className="text-xs font-mono text-neutral-400">
                        Your university project collaboration account has been suspended by campus moderation.
                    </p>
                </div>

                <Card className="p-6 border-red-500/30 bg-carbon-900 space-y-4 cad-crosshairs">
                    <div className="space-y-1 text-xs font-mono">
                        <span className="font-semibold text-red-400 uppercase tracking-wider text-[10px]">
                            Reason for suspension:
                        </span>
                        <p className="p-3.5 rounded-lg bg-carbon-950 border border-carbon-800 text-neutral-200 text-xs leading-relaxed italic font-sans">
                            &ldquo;{reason || 'Violation of AAU community guidelines.'}&rdquo;
                        </p>
                    </div>

                    {suspended_at && (
                        <p className="text-[11px] font-mono text-neutral-500">
                            Suspended on: <span className="text-white font-medium">{suspended_at}</span>
                        </p>
                    )}

                    <div className="pt-2 border-t border-carbon-800">
                        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                            While suspended, you cannot post projects, submit applications, or collaborate with peers. If you believe this action was taken in error, contact the academic administration office.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-carbon-850 hover:bg-carbon-800 text-neutral-200 transition-colors border border-carbon-700"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Log Out
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}