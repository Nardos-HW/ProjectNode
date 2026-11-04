import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/ui/PageHeader';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import { Head, usePage } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status, departments, skills, userSkills }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Profile Settings" />

            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Profile Settings"
                    subtitle="Manage your university student profile and account settings."
                    actions={
                        <Button
                            href={route('students.show', auth.user.id)}
                            variant="secondary"
                            size="sm"
                        >
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View my public profile
                        </Button>
                    }
                />

                <Card className="p-6 sm:p-8">
                    <UpdateProfileInformationForm
                        departments={departments}
                        skills={skills}
                        userSkills={userSkills}
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </Card>

                <Card className="p-6 sm:p-8">
                    <UpdatePasswordForm />
                </Card>

                <Card className="p-6 sm:p-8">
                    <DeleteUserForm />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}