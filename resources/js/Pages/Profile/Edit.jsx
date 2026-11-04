import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/ui/PageHeader';
import Card from '@/Components/ui/Card';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status, departments, skills, userSkills }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile Settings" />

            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Profile Settings"
                    subtitle="Manage your university student profile and account settings."
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