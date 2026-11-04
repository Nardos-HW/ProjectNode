import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import PageHeader from '@/Components/ui/PageHeader';
import TextArea from '@/Components/ui/TextArea';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import CategoryBadge from '@/Components/CategoryBadge';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

export default function Index({ projects, filters = {}, departments = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [targetProject, setTargetProject] = useState(null);
    const [modalAction, setModalAction] = useState(null); // 'remove' | 'restore'
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const applyFilter = (newFilters) => {
        const merged = { ...filters, ...newFilters };
        Object.keys(merged).forEach((k) => {
            if (!merged[k] || merged[k] === 'all') delete merged[k];
        });
        router.get(route('admin.projects.index'), merged, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const openModal = (project, action) => {
        setTargetProject(project);
        setModalAction(action);
        setReason('');
        setError('');
    };

    const closeModal = () => {
        setTargetProject(null);
        setModalAction(null);
        setReason('');
        setError('');
    };

    const handleConfirm = () => {
        if (!reason || reason.trim().length < 10) {
            setError('Please provide a specific moderation reason (minimum 10 characters).');
            return;
        }

        setProcessing(true);

        if (modalAction === 'remove') {
            router.delete(route('admin.projects.destroy', targetProject.id), {
                data: { reason },
                onFinish: () => {
                    setProcessing(false);
                    closeModal();
                },
                onError: (err) => {
                    setError(err.reason || 'An error occurred during removal.');
                },
            });
        } else {
            router.post(route('admin.projects.restore', targetProject.id), { reason }, {
                onFinish: () => {
                    setProcessing(false);
                    closeModal();
                },
                onError: (err) => {
                    setError(err.reason || 'An error occurred during restoration.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Project Moderation" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Campus Project Moderation"
                    subtitle="Audit student listings, review policy compliance, and remove non-compliant content."
                />

                {/* Search & Filters */}
                <Card className="p-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title or description..."
                                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-surface-2 border border-surface-2 text-text placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-violet"
                                />
                            </div>
                            <Button type="submit" variant="secondary" size="sm">
                                Search
                            </Button>
                        </form>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select
                                value={filters.status || 'all'}
                                onChange={(e) => applyFilter({ status: e.target.value })}
                                className="bg-surface-2 border border-surface-2 text-text text-xs rounded-xl px-3 py-2 focus:ring-violet focus:outline-none"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active Only</option>
                                <option value="removed">Removed Only</option>
                            </select>

                            <select
                                value={filters.department_id || ''}
                                onChange={(e) => applyFilter({ department_id: e.target.value })}
                                className="bg-surface-2 border border-surface-2 text-text text-xs rounded-xl px-3 py-2 focus:ring-violet focus:outline-none"
                            >
                                <option value="">All Departments</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Table */}
                {projects.data.length === 0 ? (
                    <EmptyState
                        title="No projects found"
                        description="Try adjusting your search criteria or filters."
                    />
                ) : (
                    <Card className="overflow-hidden border border-surface-2">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-surface-2/60 text-muted uppercase text-[10px] tracking-wider border-b border-surface-2">
                                    <tr>
                                        <th className="py-3 px-4">Project</th>
                                        <th className="py-3 px-4">Owner</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4">Capacity</th>
                                        <th className="py-3 px-4">State</th>
                                        <th className="py-3 px-4 text-right">Moderation Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-2/60 text-text">
                                    {projects.data.map((project) => (
                                        <tr key={project.id} className="hover:bg-surface-2/30 transition-colors">
                                            <td className="py-3 px-4 max-w-xs space-y-1">
                                                <div className="font-semibold text-text truncate">
                                                    {project.deleted_at ? (
                                                        <span className="line-through text-muted">{project.title}</span>
                                                    ) : (
                                                        <Link href={route('projects.show', project.id)} className="hover:text-violet">
                                                            {project.title}
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-muted line-clamp-1">{project.description}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-text">{project.owner?.name}</div>
                                                <div className="text-muted text-[11px] font-mono">{project.owner?.email}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <CategoryBadge category={project.category} />
                                            </td>
                                            <td className="py-3 px-4 text-muted">
                                                {project.accepted_count} / {project.slots_total} slots
                                            </td>
                                            <td className="py-3 px-4">
                                                {project.deleted_at ? (
                                                    <Badge variant="coral" size="sm">Removed</Badge>
                                                ) : (
                                                    <Badge variant="mint" size="sm">Active</Badge>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {project.deleted_at ? (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => openModal(project, 'restore')}
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restore
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => openModal(project, 'remove')}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                <Pagination links={projects.links} />

                {/* Moderation Dialog */}
                <ConfirmDialog
                    show={targetProject !== null}
                    title={modalAction === 'remove' ? `Remove Project: ${targetProject?.title}` : `Restore Project: ${targetProject?.title}`}
                    danger={modalAction === 'remove'}
                    confirmText={modalAction === 'remove' ? 'Remove Listing' : 'Restore Listing'}
                    loading={processing}
                    onClose={closeModal}
                    onConfirm={handleConfirm}
                    content={
                        <div className="space-y-4">
                            <p className="text-xs text-muted leading-relaxed">
                                {modalAction === 'remove'
                                    ? 'Removing this project will soft-delete it and remove it from all discovery feeds and student views. A formal moderation justification is required.'
                                    : 'Restoring this project returns it to discovery feeds if its deadline and capacity allow.'}
                            </p>

                            <TextArea
                                label="Moderation Justification"
                                required
                                rows={4}
                                maxLength={500}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                error={error}
                                placeholder="Explain why this listing is being removed or reinstated (minimum 10 characters)..."
                            />
                        </div>
                    }
                />
            </div>
        </AuthenticatedLayout>
    );
}