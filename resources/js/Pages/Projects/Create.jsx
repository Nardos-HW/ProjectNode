import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import PageHeader from '@/Components/ui/PageHeader';
import ProjectForm from '@/Components/ProjectForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ departments, skills, categories, defaultTelegram }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category: '',
        department_id: '',
        slots_total: 2,
        hours_per_week: 10,
        duration_weeks: 4,
        application_deadline: '',
        telegram_contact: defaultTelegram || '',
        skill_ids: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Post a Project" />

            <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Post a New Project"
                    subtitle="Publish an initiative to find fellow student collaborators."
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
                        submitLabel="Publish Project"
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}