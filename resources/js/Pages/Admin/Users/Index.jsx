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
import { Head, router } from '@inertiajs/react';
import { Search, ShieldAlert, ShieldCheck, UserX, UserCheck } from 'lucide-react';

export default function Index({ users, filters = {}, departments = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [targetUser, setTargetUser] = useState(null);
    const [modalAction, setModalAction] = useState(null); // 'suspend' | 'unsuspend'
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const applyFilter = (newFilters) => {
        const merged = { ...filters, ...newFilters };
        Object.keys(merged).forEach((k) => {
            if (!merged[k] || merged[k] === 'all') delete merged[k];
        });
        router.get(route('admin.users.index'), merged, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const openModal = (user, action) => {
        setTargetUser(user);
        setModalAction(action);
        setReason('');
        setError('');
    };

    const closeModal = () => {
        setTargetUser(null);
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
        const endpoint = modalAction === 'suspend'
            ? route('admin.users.suspend', targetUser.id)
            : route('admin.users.unsuspend', targetUser.id);

        router.post(endpoint, { reason }, {
            onFinish: () => {
                setProcessing(false);
                closeModal();
            },
            onError: (err) => {
                setError(err.reason || 'An error occurred during submission.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - User Management" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Student Directory & Moderation"
                    subtitle="Monitor university accounts, enforce academic conduct, and manage suspensions."
                />

                {/* Search & Filters */}
                <Card className="p-4 space-y-4 bg-white border border-neutral-200/80 shadow-xs">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by student name or university email..."
                                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-neutral-50/70 border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-blue-500 font-mono"
                                />
                            </div>
                            <Button type="submit" variant="secondary" size="sm">
                                Search
                            </Button>
                        </form>

                        <div className="flex items-center gap-3 w-full md:w-auto font-mono">
                            <select
                                value={filters.status || 'all'}
                                onChange={(e) => applyFilter({ status: e.target.value })}
                                className="bg-white border border-neutral-200 text-neutral-700 text-xs rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="all">All Account Statuses</option>
                                <option value="active">Active Only</option>
                                <option value="suspended">Suspended Only</option>
                            </select>

                            <select
                                value={filters.department_id || ''}
                                onChange={(e) => applyFilter({ department_id: e.target.value })}
                                className="bg-white border border-neutral-200 text-neutral-700 text-xs rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
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

                {/* User Table */}
                {users.data.length === 0 ? (
                    <EmptyState
                        title="No students found"
                        description="Try adjusting your search criteria or filters."
                    />
                ) : (
                    <Card className="overflow-hidden border border-neutral-200/80 shadow-card p-0 bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] tracking-wider border-b border-neutral-200/80">
                                    <tr>
                                        <th className="py-3 px-4">Student</th>
                                        <th className="py-3 px-4">Department</th>
                                        <th className="py-3 px-4">Activity</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Moderation Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-neutral-50/70 transition-colors">
                                            <td className="py-3 px-4 space-y-0.5">
                                                <div className="font-semibold text-neutral-950 flex items-center gap-2">
                                                    <span>{user.name}</span>
                                                    {user.role === 'admin' && (
                                                        <Badge variant="coral" size="sm">Admin</Badge>
                                                    )}
                                                </div>
                                                <div className="text-neutral-400 text-[11px] font-mono">{user.email}</div>
                                            </td>
                                            <td className="py-3 px-4 text-neutral-600 font-sans">
                                                {user.department?.name || 'General Campus'}
                                                {user.year_of_study ? ` (Yr ${user.year_of_study})` : ''}
                                            </td>
                                            <td className="py-3 px-4 text-neutral-500 space-x-2">
                                                <span>{user.owned_projects_count} projects</span>
                                                <span>&bull;</span>
                                                <span>{user.join_requests_count} applications</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {user.suspended_at ? (
                                                    <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                                                        <ShieldAlert className="w-3.5 h-3.5" /> Suspended
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                                                        <ShieldCheck className="w-3.5 h-3.5" /> Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {user.role !== 'admin' && (
                                                    user.suspended_at ? (
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => openModal(user, 'unsuspend')}
                                                        >
                                                            <UserCheck className="w-3.5 h-3.5 mr-1" /> Re-instate
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => openModal(user, 'suspend')}
                                                        >
                                                            <UserX className="w-3.5 h-3.5 mr-1" /> Suspend
                                                        </Button>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                <Pagination links={users.links} />

                {/* Moderation Action Modal */}
                <ConfirmDialog
                    show={targetUser !== null}
                    title={modalAction === 'suspend' ? `Suspend Account: ${targetUser?.name}` : `Re-instate Account: ${targetUser?.name}`}
                    danger={modalAction === 'suspend'}
                    confirmText={modalAction === 'suspend' ? 'Suspend Account' : 'Re-instate Account'}
                    loading={processing}
                    onClose={closeModal}
                    onConfirm={handleConfirm}
                    content={
                        <div className="space-y-4">
                            <p className="text-xs text-neutral-600 leading-relaxed">
                                {modalAction === 'suspend'
                                    ? 'Suspending this account immediately evicts all active logins and hides their projects from campus feeds. A formal moderation reason is logged.'
                                    : 'Re-instating this account restores their access and unhides their recruiting listings.'}
                            </p>

                            <TextArea
                                label="Moderation Reason"
                                required
                                rows={4}
                                maxLength={500}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                error={error}
                                placeholder="Explain the violation or justification for this moderation decision (minimum 10 characters)..."
                            />
                        </div>
                    }
                />
            </div>
        </AuthenticatedLayout>
    );
}
