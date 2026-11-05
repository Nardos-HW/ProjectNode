import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import PageHeader from '@/Components/ui/PageHeader';
import EmptyState from '@/Components/ui/EmptyState';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function Index({ conversations }) {
    const list = conversations?.data || conversations || [];

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Direct Messages" />

            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Direct Messages"
                    subtitle="Private 1-on-1 collaboration channels with accepted project partners."
                />

                {list.length === 0 ? (
                    <EmptyState
                        title="No conversations yet"
                        description="No conversations yet. Once a join request is accepted, you can message each other here."
                    />
                ) : (
                    <div className="space-y-3">
                        {list.map((conv) => {
                            const timeLabel = formatTime(conv.last_message_at);

                            return (
                                <Link
                                    key={conv.id}
                                    href={route('messages.show', conv.id)}
                                    className="block group"
                                >
                                    <Card
                                        hover
                                        className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cad-crosshairs"
                                    >
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                                                <span className="font-bold text-white group-hover:text-flame-500 transition-colors text-sm font-display">
                                                    {conv.counterpart?.name}
                                                </span>
                                                <span className="text-neutral-500">&bull;</span>
                                                <span className="text-neutral-400 truncate max-w-xs">
                                                    {conv.project?.title}
                                                </span>
                                                {conv.unread_count > 0 && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-flame-500/20 text-flame-500 border border-flame-500/40">
                                                        {conv.unread_count} new
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-neutral-400 line-clamp-1 truncate font-sans">
                                                {conv.last_message || (
                                                    <span className="italic text-neutral-500">
                                                        No messages yet. Say hello!
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs font-mono text-neutral-500">
                                            {timeLabel && <span>{timeLabel}</span>}
                                            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-flame-500 group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

