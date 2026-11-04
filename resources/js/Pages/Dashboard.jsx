import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import PageHeader from '@/Components/ui/PageHeader';
import Button from '@/Components/ui/Button';
import { Head, Link } from '@inertiajs/react';
import { Compass, PlusCircle, FileText } from 'lucide-react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Student Dashboard"
                    subtitle="Welcome to your ProjectNode collaboration hub."
                    actions={
                        <Button href={route('projects.create')} variant="primary" size="sm">
                            <PlusCircle className="w-4 h-4 mr-1.5" /> Post a Project
                        </Button>
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card hover className="p-6 space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-violet/15 flex items-center justify-center text-violet">
                            <Compass className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold font-display text-text">Explore Projects</h3>
                        <p className="text-xs text-muted leading-relaxed">
                            Find fellow AAU students actively recruiting team members across campus.
                        </p>
                        <div className="pt-2">
                            <Button href={route('projects.index')} variant="secondary" size="sm">
                                Browse Feed
                            </Button>
                        </div>
                    </Card>

                    <Card hover className="p-6 space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-mint/15 flex items-center justify-center text-mint">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold font-display text-text">My Applications</h3>
                        <p className="text-xs text-muted leading-relaxed">
                            Track the status of your join requests and connect with project creators.
                        </p>
                        <div className="pt-2">
                            <Button href={route('applications.index')} variant="secondary" size="sm">
                                View Applications
                            </Button>
                        </div>
                    </Card>

                    <Card hover className="p-6 space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-amber/15 flex items-center justify-center text-amber">
                            <PlusCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold font-display text-text">Start a Project</h3>
                        <p className="text-xs text-muted leading-relaxed">
                            Publish a side project, hackathon, or study group to recruit collaborators.
                        </p>
                        <div className="pt-2">
                            <Button href={route('projects.create')} variant="secondary" size="sm">
                                Create Listing
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}