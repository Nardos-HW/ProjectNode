import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import PageHeader from '@/Components/ui/PageHeader';
import Button from '@/Components/ui/Button';
import EmptyState from '@/Components/ui/EmptyState';
import { Head, Link } from '@inertiajs/react';

export default function Index({ applications }) {
    return (
        <AuthenticatedLayout>
            <Head title="My Applications" />

            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="My Collaboration Applications"
                    subtitle="Track the status of your join requests."
                />

                {applications.length === 0 ? (
                    <EmptyState
                        title="No applications sent yet"
                        description="Explore recruiting projects across Addis Ababa University and apply to collaborate."
                        action={
                            <Button href={route('projects.index')} variant="primary">
                                Browse Projects
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <Card key={app.id} className="p-6 space-y-3 cad-crosshairs">
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-carbon-800">
                                    <div>
                                        <h3 className="text-base font-bold font-display text-white">
                                            <Link href={route('projects.show', app.project.id)} className="hover:text-flame-500 transition-colors">
                                                {app.project.title}
                                            </Link>
                                        </h3>
                                        <p className="text-xs font-mono text-neutral-400 mt-0.5">
                                            Led by {app.project.owner_name} &bull; Applied on {app.created_at}
                                        </p>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-carbon-850 text-neutral-300 border border-carbon-700 capitalize">
                                        {app.status_label}
                                    </span>
                                </div>

                                <div className="text-xs text-neutral-400 italic">
                                    &ldquo;{app.message}&rdquo;
                                </div>

                                {app.status === 'accepted' && app.project.telegram_contact && (
                                    <div className="p-3.5 rounded-lg bg-carbon-950 border border-emerald-500/30 text-xs text-neutral-200 space-y-1 font-mono">
                                        <p className="font-semibold text-emerald-400">Accepted Collaborator Access</p>
                                        <p>
                                            Connect directly with the creator on Telegram:{' '}
                                            <a
                                                href={`https://t.me/${app.project.telegram_contact}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold underline text-emerald-400 hover:text-emerald-300"
                                            >
                                                @{app.project.telegram_contact}
                                            </a>
                                        </p>
                                    </div>
                                )}

                                {app.status === 'accepted' && app.conversation_id && (
                                    <div className="pt-2 flex items-center justify-end">
                                        <Button
                                            href={route('messages.show', app.conversation_id)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Message
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