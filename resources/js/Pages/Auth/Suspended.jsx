import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, LogOut } from 'lucide-react';

export default function Suspended({ reason, suspended_at }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-ink selection:bg-coral selection:text-white">
            <Head title="Account Suspended" />

            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-coral/15 text-coral border border-coral/30 mb-2">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold font-display text-text">Account Suspended</h1>
                    <p className="text-xs text-muted">
                        Your university project collaboration account has been suspended by campus moderation.
                    </p>
                </div>

                <Card className="p-6 border-coral/30 bg-surface space-y-4">
                    <div className="space-y-1 text-xs">
                        <span className="font-semibold text-coral uppercase tracking-wider text-[10px]">
                            Reason for suspension:
                        </span>
                        <p className="p-3.5 rounded-xl bg-surface-2/60 border border-surface-2 text-text text-xs leading-relaxed italic">
                            &ldquo;{reason || 'Violation of AAU community guidelines.'}&rdquo;
                        </p>
                    </div>

                    {suspended_at && (
                        <p className="text-[11px] text-muted">
                            Suspended on: <span className="text-text font-medium">{suspended_at}</span>
                        </p>
                    )}

                    <div className="pt-2 border-t border-surface-2">
                        <p className="text-xs text-muted leading-relaxed">
                            While suspended, you cannot post projects, submit applications, or collaborate with peers. If you believe this action was taken in error, contact the academic administration office.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-surface-2 hover:bg-surface-2/80 text-text transition-colors border border-surface-2"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Log Out
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}