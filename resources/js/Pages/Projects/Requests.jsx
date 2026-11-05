import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import EmptyState from '@/Components/ui/EmptyState';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useState } from 'react';

export default function Requests({ project, requests }) {
    const [actionId, setActionId] = useState(null);

    const handleAccept = (requestId) => {
        setActionId(requestId);
        router.patch(route('join-requests.accept', requestId), {}, {
            onFinish: () => setActionId(null),
        });
    };

    const handleReject = (requestId) => {
        setActionId(requestId);
        router.patch(route('join-requests.reject', requestId), {}, {
            onFinish: () => setActionId(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Applications - ${project.title}`} />

            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <Button href={route('projects.show', project.id)} variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Project
                        </Button>
                        <h1 className="text-xl font-bold font-display text-white mt-2">
                            Applicant Inbox: {project.title}
                        </h1>
                    </div>
                    <div className="text-xs text-neutral-300 font-mono bg-carbon-900 px-3 py-1.5 rounded-lg border border-carbon-800 self-start sm:self-auto">
                        Capacity: {project.accepted_count} / {project.slots_total} filled
                    </div>
                </div>

                {requests.length === 0 ? (
                    <EmptyState
                        title="No join requests yet"
                        description="When students apply to collaborate on this project, their requests will appear here."
                    />
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <Card key={req.id} className="p-6 space-y-4 cad-crosshairs">
                                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-carbon-800">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={route('students.show', req.applicant.id)}
                                                className="text-base font-bold font-display text-white hover:text-flame-500 transition-colors"
                                            >
                                                {req.applicant.name}
                                            </Link>
                                            <span className="text-xs font-mono text-neutral-400">
                                                {req.applicant.department?.name || 'General Campus'} &bull; Year {req.applicant.year_of_study || 'N/A'}
                                            </span>
                                        </div>
                                        <p className="text-xs font-mono text-emerald-400 mt-1">
                                            Telegram:{' '}
                                            <a
                                                href={`https://t.me/${req.applicant.telegram_handle}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium hover:underline"
                                            >
                                                @{req.applicant.telegram_handle}
                                            </a>
                                        </p>
                                    </div>

                                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-carbon-850 text-neutral-300 border border-carbon-700 capitalize">
                                        {req.status}
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-lg bg-carbon-950 border border-carbon-800 text-xs text-neutral-200 leading-relaxed font-sans">
                                    <p className="font-semibold text-neutral-400 text-[11px] font-mono uppercase tracking-wider mb-1">
                                        Application Note:
                                    </p>
                                    {req.message}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                                    <div>
                                        <p className="text-neutral-400 uppercase tracking-wider text-[11px] font-medium mb-1">Applicant Skills:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {req.applicant.skills && req.applicant.skills.length > 0 ? (
                                                req.applicant.skills.map((skill) => (
                                                    <span key={skill.id} className="px-2 py-0.5 rounded bg-carbon-850 border border-carbon-700 text-[11px] text-neutral-300">
                                                        {skill.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-neutral-500">None listed</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-neutral-400 uppercase tracking-wider text-[11px] font-medium mb-1">Bio:</p>
                                        <p className="text-neutral-400 line-clamp-2">{req.applicant.bio || 'No bio provided'}</p>
                                    </div>
                                </div>

                                {req.status === 'pending' && (
                                    <div className="pt-3 border-t border-carbon-800 flex items-center justify-end gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleReject(req.id)}
                                            loading={actionId === req.id}
                                            disabled={actionId !== null}
                                        >
                                            <X className="w-4 h-4 mr-1" /> Decline
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleAccept(req.id)}
                                            loading={actionId === req.id}
                                            disabled={actionId !== null || project.accepted_count >= project.slots_total}
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            {project.accepted_count >= project.slots_total ? 'Project Full' : 'Accept Applicant'}
                                        </Button>
                                    </div>
                                )}

                                {req.status === 'accepted' && req.conversation_id && (
                                    <div className="pt-3 border-t border-carbon-800 flex items-center justify-end">
                                        <Button
                                            href={route('messages.show', req.conversation_id)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Message {req.applicant.name}
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}