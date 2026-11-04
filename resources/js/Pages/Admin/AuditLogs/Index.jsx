import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import PageHeader from '@/Components/ui/PageHeader';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import { Head, router } from '@inertiajs/react';
import { Shield, Clock, Filter } from 'lucide-react';

export default function Index({ actions, filters = {}, admins = [] }) {
    const applyFilter = (newFilters) => {
        const merged = { ...filters, ...newFilters };
        Object.keys(merged).forEach((k) => {
            if (!merged[k] || merged[k] === 'all') delete merged[k];
        });
        router.get(route('admin.audit-logs.index'), merged, {
            preserveState: true,
            replace: true,
        });
    };

    const actionBadge = (action) => {
        switch (action) {
            case 'user_suspended':
                return <Badge variant="coral">User Suspended</Badge>;
            case 'user_unsuspended':
                return <Badge variant="mint">User Reinstated</Badge>;
            case 'project_removed':
                return <Badge variant="coral">Project Removed</Badge>;
            case 'project_restored':
                return <Badge variant="mint">Project Restored</Badge>;
            default:
                return <Badge variant="neutral">{action}</Badge>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Moderation Audit Log" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Moderation Audit Log"
                    subtitle="Immutable, chronological log of all administrative suspensions, reinstatements, and content removals."
                />

                {/* Filters */}
                <Card className="p-4 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted font-medium">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Filter Log:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filters.action || 'all'}
                            onChange={(e) => applyFilter({ action: e.target.value })}
                            className="bg-surface-2 border border-surface-2 text-text text-xs rounded-xl px-3 py-2 focus:ring-violet focus:outline-none"
                        >
                            <option value="all">All Action Types</option>
                            <option value="user_suspended">User Suspended</option>
                            <option value="user_unsuspended">User Reinstated</option>
                            <option value="project_removed">Project Removed</option>
                            <option value="project_restored">Project Restored</option>
                        </select>

                        <select
                            value={filters.target_type || 'all'}
                            onChange={(e) => applyFilter({ target_type: e.target.value })}
                            className="bg-surface-2 border border-surface-2 text-text text-xs rounded-xl px-3 py-2 focus:ring-violet focus:outline-none"
                        >
                            <option value="all">All Targets</option>
                            <option value="user">Users Only</option>
                            <option value="project">Projects Only</option>
                        </select>

                        <select
                            value={filters.admin_id || ''}
                            onChange={(e) => applyFilter({ admin_id: e.target.value })}
                            className="bg-surface-2 border border-surface-2 text-text text-xs rounded-xl px-3 py-2 focus:ring-violet focus:outline-none"
                        >
                            <option value="">All Administrators</option>
                            {admins.map((admin) => (
                                <option key={admin.id} value={admin.id}>
                                    {admin.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </Card>

                {/* Audit Table */}
                {actions.data.length === 0 ? (
                    <EmptyState
                        title="No moderation actions logged"
                        description="Administrative interventions will appear here as an append-only audit trail."
                    />
                ) : (
                    <Card className="overflow-hidden border border-surface-2">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-surface-2/60 text-muted uppercase text-[10px] tracking-wider border-b border-surface-2">
                                    <tr>
                                        <th className="py-3 px-4">Timestamp</th>
                                        <th className="py-3 px-4">Action</th>
                                        <th className="py-3 px-4">Target Entity</th>
                                        <th className="py-3 px-4">Administrator</th>
                                        <th className="py-3 px-4">Justification / Reason</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-2/60 text-text">
                                    {actions.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-surface-2/30 transition-colors">
                                            <td className="py-3 px-4 text-muted font-mono whitespace-nowrap text-[11px]">
                                                {log.created_at}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {actionBadge(log.action)}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-text">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="capitalize text-muted text-[11px] font-semibold">
                                                        [{log.target_type}]
                                                    </span>
                                                    <span className="truncate max-w-xs">{log.target_label}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <div className="font-semibold text-text">{log.admin.name}</div>
                                                <div className="text-[10px] text-muted font-mono">{log.admin.email}</div>
                                            </td>
                                            <td className="py-3 px-4 text-muted leading-relaxed max-w-sm">
                                                &ldquo;{log.reason}&rdquo;
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                <Pagination links={actions.links} />
            </div>
        </AuthenticatedLayout>
    );
}