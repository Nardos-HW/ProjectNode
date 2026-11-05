import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import PageHeader from '@/Components/ui/PageHeader';
import SlotDots from '@/Components/ui/SlotDots';
import DeadlineRing from '@/Components/ui/DeadlineRing';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import CategoryBadge from '@/Components/CategoryBadge';
import ProjectStatusBadge from '@/Components/ProjectStatusBadge';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

export default function Index({
    projects,
    filters = {},
    departments = [],
    skills = [],
    categories = [],
}) {
    const [search, setSearch] = useState(filters.q || '');
    const [showFilters, setShowFilters] = useState(false);

    const applyFilter = (newFilters) => {
        const merged = { ...filters, ...newFilters };

        // Clean empty keys
        Object.keys(merged).forEach((k) => {
            if (merged[k] === '' || merged[k] === null || (Array.isArray(merged[k]) && merged[k].length === 0)) {
                delete merged[k];
            }
        });

        router.get(route('projects.index'), merged, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilter({ q: search });
    };

    const handleClearAll = () => {
        setSearch('');
        router.get(route('projects.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleRemoveSkill = (skillId) => {
        const currentSkills = Array.isArray(filters.skills) ? filters.skills.map(Number) : [];
        const updated = currentSkills.filter((id) => id !== Number(skillId));
        applyFilter({ skills: updated });
    };

    const isDeadlinePassed = (deadline) => {
        if (!deadline) return false;
        const target = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return target < today;
    };

    const activeSkillsList = Array.isArray(filters.skills)
        ? filters.skills.map((id) => skills.find((s) => s.id === Number(id))).filter(Boolean)
        : [];

    const hasActiveFilters = Boolean(
        filters.q ||
        filters.category ||
        filters.department_id ||
        (filters.skills && filters.skills.length > 0) ||
        filters.deadline_within ||
        filters.posted ||
        filters.include_closed ||
        (filters.sort && filters.sort !== 'newest')
    );

    return (
        <AuthenticatedLayout>
            <Head title="Discover Projects" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Discover Projects"
                    subtitle="Find collaboration opportunities across Addis Ababa University."
                    actions={
                        <Button href={route('projects.create')} variant="primary" size="sm">
                            <PlusCircle className="w-4 h-4 mr-1.5" /> Post Project
                        </Button>
                    }
                />

                {/* Search & Filter Toolbar */}
                <Card className="p-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        {/* Keyword Search Box */}
                        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title, description or keyword..."
                                    maxLength={100}
                                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg bg-carbon-950 border border-carbon-800 text-white placeholder-neutral-600 focus:outline-none focus:border-flame-500 focus:ring-1 focus:ring-flame-500 transition-colors font-mono"
                                />
                            </div>
                            <Button type="submit" variant="secondary" size="sm">
                                Search
                            </Button>
                        </form>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                            {/* Sort Selector */}
                            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                                <ArrowUpDown className="w-3.5 h-3.5" />
                                <select
                                    value={filters.sort || 'newest'}
                                    onChange={(e) => applyFilter({ sort: e.target.value })}
                                    className="bg-carbon-950 border border-carbon-800 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:border-flame-500 focus:outline-none font-mono"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="deadline">Closing Soonest</option>
                                </select>
                            </div>

                            {/* Filter Panel Toggle */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`border ${showFilters ? 'bg-carbon-850 text-white border-carbon-700' : 'border-carbon-800 text-neutral-400'}`}
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="pt-4 border-t border-carbon-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                            {/* Category Filter */}
                            <div className="space-y-1">
                                <label className="text-neutral-400 uppercase tracking-wider text-[11px]">Category</label>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => applyFilter({ category: e.target.value })}
                                    className="w-full bg-carbon-950 border border-carbon-800 text-neutral-200 text-xs rounded-lg p-2 focus:border-flame-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Department Filter */}
                            <div className="space-y-1">
                                <label className="text-neutral-400 uppercase tracking-wider text-[11px]">Department</label>
                                <select
                                    value={filters.department_id || ''}
                                    onChange={(e) => applyFilter({ department_id: e.target.value })}
                                    className="w-full bg-carbon-950 border border-carbon-800 text-neutral-200 text-xs rounded-lg p-2 focus:border-flame-500"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Deadline Filter */}
                            <div className="space-y-1">
                                <label className="text-neutral-400 uppercase tracking-wider text-[11px]">Application Deadline</label>
                                <select
                                    value={filters.deadline_within || ''}
                                    onChange={(e) => applyFilter({ deadline_within: e.target.value })}
                                    className="w-full bg-carbon-950 border border-carbon-800 text-neutral-200 text-xs rounded-lg p-2 focus:border-flame-500"
                                >
                                    <option value="">Any Deadline</option>
                                    <option value="7">Within 7 days</option>
                                    <option value="14">Within 14 days</option>
                                    <option value="30">Within 30 days</option>
                                </select>
                            </div>

                            {/* Posted Filter & Closed Toggle */}
                            <div className="space-y-2">
                                <div className="space-y-1">
                                    <label className="text-neutral-400 uppercase tracking-wider text-[11px]">Posted Date</label>
                                    <select
                                        value={filters.posted || ''}
                                        onChange={(e) => applyFilter({ posted: e.target.value })}
                                        className="w-full bg-carbon-950 border border-carbon-800 text-neutral-200 text-xs rounded-lg p-2 focus:border-flame-500"
                                    >
                                        <option value="">Any Time</option>
                                        <option value="7">Last 7 days</option>
                                        <option value="30">Last 30 days</option>
                                    </select>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer pt-1 text-neutral-400 select-none">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(filters.include_closed)}
                                        onChange={(e) => applyFilter({ include_closed: e.target.checked ? 1 : '' })}
                                        className="rounded border-carbon-700 text-flame-500 focus:ring-flame-500 bg-carbon-900"
                                    />
                                    <span>Include closed</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Active Filter Chips & Result Counter */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
                        <span className="text-neutral-400 font-mono">
                            Showing <span className="text-white font-bold">{projects.total ?? projects.data.length}</span> project{projects.total === 1 ? '' : 's'}
                        </span>

                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                {filters.q && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-carbon-850 text-neutral-200 border border-carbon-700">
                                        Keyword: &ldquo;{filters.q}&rdquo;
                                        <button type="button" onClick={() => { setSearch(''); applyFilter({ q: '' }); }}>
                                            <X className="w-3 h-3 text-neutral-500 hover:text-red-400" />
                                        </button>
                                    </span>
                                )}

                                {filters.category && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-carbon-850 text-neutral-200 border border-carbon-700 capitalize">
                                        {filters.category.replace('_', ' ')}
                                        <button type="button" onClick={() => applyFilter({ category: '' })}>
                                            <X className="w-3 h-3 text-neutral-500 hover:text-red-400" />
                                        </button>
                                    </span>
                                )}

                                {filters.department_id && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-carbon-850 text-neutral-200 border border-carbon-700">
                                        {departments.find((d) => d.id === Number(filters.department_id))?.name || 'Department'}
                                        <button type="button" onClick={() => applyFilter({ department_id: '' })}>
                                            <X className="w-3 h-3 text-neutral-500 hover:text-red-400" />
                                        </button>
                                    </span>
                                )}

                                {activeSkillsList.map((skill) => (
                                    <span key={skill.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-flame-500/10 text-flame-500 border border-flame-500/30">
                                        {skill.name}
                                        <button type="button" onClick={() => handleRemoveSkill(skill.id)}>
                                            <X className="w-3 h-3 text-flame-500 hover:text-red-400" />
                                        </button>
                                    </span>
                                ))}

                                {filters.deadline_within && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-carbon-850 text-neutral-200 border border-carbon-700">
                                        Within {filters.deadline_within}d
                                        <button type="button" onClick={() => applyFilter({ deadline_within: '' })}>
                                            <X className="w-3 h-3 text-neutral-500 hover:text-red-400" />
                                        </button>
                                    </span>
                                )}

                                {filters.posted && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-carbon-850 text-neutral-200 border border-carbon-700">
                                        Past {filters.posted}d
                                        <button type="button" onClick={() => applyFilter({ posted: '' })}>
                                            <X className="w-3 h-3 text-neutral-500 hover:text-red-400" />
                                        </button>
                                    </span>
                                )}

                                {filters.include_closed && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-carbon-850 text-neutral-200 border border-carbon-700">
                                        Including closed
                                        <button type="button" onClick={() => applyFilter({ include_closed: '' })}>
                                            <X className="w-3 h-3 text-neutral-500 hover:text-red-400" />
                                        </button>
                                    </span>
                                )}

                                <button
                                    type="button"
                                    onClick={handleClearAll}
                                    className="text-flame-500 hover:underline ml-1 font-mono font-medium"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Results Listing */}
                {projects.data.length === 0 ? (
                    hasActiveFilters ? (
                        <EmptyState
                            title="No projects match your filters"
                            description="Try adjusting or clearing your search term, category, or deadline filters."
                            action={
                                <Button onClick={handleClearAll} variant="secondary">
                                    Reset Filters
                                </Button>
                            }
                        />
                    ) : (
                        <EmptyState
                            title="No projects yet"
                            description="No projects are currently open for recruitment across campus."
                            action={
                                <Button href={route('projects.create')} variant="primary">
                                    Post the First Project
                                </Button>
                            }
                        />
                    )
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.data.map((project) => {
                            const isFull = (project.accepted_count ?? 0) >= project.slots_total;
                            const deadlinePassed = isDeadlinePassed(project.application_deadline);

                            return (
                                <Card key={project.id} hover className="flex flex-col justify-between p-6 cad-crosshairs">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <CategoryBadge category={project.category} />
                                            <ProjectStatusBadge
                                                status={project.status}
                                                isRecruiting={project.is_recruiting}
                                                isFull={isFull}
                                                deadlinePassed={deadlinePassed}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold font-display text-white line-clamp-1">
                                                <Link
                                                    href={route('projects.show', project.id)}
                                                    className="hover:text-flame-500 transition-colors"
                                                >
                                                    {project.title}
                                                </Link>
                                            </h3>
                                            <p className="mt-2 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>

                                        {project.skills && project.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.skills.slice(0, 4).map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="px-2 py-0.5 rounded bg-carbon-850 text-neutral-300 text-[11px] font-mono border border-carbon-700"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))}
                                                {project.skills.length > 4 && (
                                                    <span className="text-[11px] font-mono text-neutral-500 self-center">
                                                        +{project.skills.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-carbon-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
                                        <SlotDots filled={project.accepted_count ?? 0} total={project.slots_total} />
                                        <DeadlineRing deadline={project.application_deadline} />
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                <Pagination links={projects.links} />
            </div>
        </AuthenticatedLayout>
    );
}