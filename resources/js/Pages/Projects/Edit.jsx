import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import PageHeader from '@/Components/ui/PageHeader';
import Button from '@/Components/ui/Button';
import ProjectForm from '@/Components/ProjectForm';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Edit({ project, departments, skills, categories }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        department_id: project.department_id || '',
        slots_total: project.slots_total || 1,
        hours_per_week: project.hours_per_week || 5,
        duration_weeks: project.duration_weeks || 4,
        application_deadline: project.application_deadline || '',
        telegram_contact: project.telegram_contact || '',
        skill_ids: project.skill_ids || [],
        new_skills: [],
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('projects.update', project.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit - ${project.title}`} />

            <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <Button href={route('projects.show', project.id)} variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Project
                </Button>

                <PageHeader
                    title="Edit Project Listing"
                    subtitle="Update your project scope, capacity, deadline, or required skills."
                />

                <Card className="p-6 sm:p-8">
                    <ProjectForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={submit}
                        departments={departments}
                        skills={skills}
                        categories={categories}
                        submitLabel="Save Changes"
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}