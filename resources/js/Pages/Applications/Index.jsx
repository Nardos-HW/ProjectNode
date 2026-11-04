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
                            <Card key={app.id} className="p-6 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-2">
                                    <div>
                                        <h3 className="text-base font-bold font-display text-text">
                                            <Link href={route('projects.show', app.project.id)} className="hover:text-violet transition-colors">
                                                {app.project.title}
                                            </Link>
                                        </h3>
                                        <p className="text-xs text-muted mt-0.5">
                                            Led by {app.project.owner_name} &bull; Applied on {app.created_at}
                                        </p>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-text border border-surface-2 capitalize">
                                        {app.status_label}
                                    </span>
                                </div>

                                <div className="text-xs text-muted italic">
                                    &ldquo;{app.message}&rdquo;
                                </div>

                                {app.status === 'accepted' && app.project.telegram_contact && (
                                    <div className="p-3.5 rounded-xl bg-mint/10 border border-mint/20 text-xs text-text space-y-1">
                                        <p className="font-semibold text-mint">Accepted Collaborator Access</p>
                                        <p>
                                            Connect directly with the creator on Telegram:{' '}
                                            <a
                                                href={`https://t.me/${app.project.telegram_contact}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold underline text-mint hover:brightness-125"
                                            >
                                                @{app.project.telegram_contact}
                                            </a>
                                        </p>
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