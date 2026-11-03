import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/ui/Button';
import Card from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import TextField from '@/Components/ui/TextField';
import TextArea from '@/Components/ui/TextArea';
import Select from '@/Components/ui/Select';
import SlotDots from '@/Components/ui/SlotDots';
import DeadlineRing from '@/Components/ui/DeadlineRing';
import EmptyState from '@/Components/ui/EmptyState';
import Skeleton from '@/Components/ui/Skeleton';
import PageHeader from '@/Components/ui/PageHeader';
import Pagination from '@/Components/ui/Pagination';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import FormSection from '@/Components/ui/FormSection';

export default function DesignSystem() {
    const [titleInput, setTitleInput] = useState('Campus Shuttle Redesign');
    const [descInput, setDescInput] = useState('A collaboration project to overhaul the AAU shuttle tracking system.');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [slots, setSlots] = useState(2);

    const dummyLinks = [
        { url: null, label: '&laquo; Previous', active: false },
        { url: '#', label: '1', active: true },
        { url: '#', label: '2', active: false },
        { url: '#', label: 'Next &raquo;', active: false },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Design System Preview" />

            <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <PageHeader
                    title="Campus Constellation Design System"
                    subtitle="Interactive preview of all design tokens and UI components."
                    actions={
                        <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
                            Open Modal
                        </Button>
                    }
                />

                {/* Buttons */}
                <Card>
                    <h2 className="text-lg font-bold font-display text-text mb-4">Buttons</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Danger</Button>
                        <Button variant="primary" loading>Loading</Button>
                        <Button variant="secondary" disabled>Disabled</Button>
                    </div>
                </Card>

                {/* Badges */}
                <Card>
                    <h2 className="text-lg font-bold font-display text-text mb-4">Badges</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="violet">Violet Badge</Badge>
                        <Badge variant="amber">Amber Badge</Badge>
                        <Badge variant="mint">Mint Badge</Badge>
                        <Badge variant="coral">Coral Badge</Badge>
                        <Badge variant="neutral">Neutral Badge</Badge>
                    </div>
                </Card>

                {/* Form Controls & Counters */}
                <Card>
                    <h2 className="text-lg font-bold font-display text-text mb-4">Form Inputs & Counters (L9)</h2>
                    <FormSection title="Sample Project Form" description="Inputs demonstrate character limits, focus rings, and validation styling.">
                        <TextField
                            label="Project Title"
                            maxLength={120}
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            hint="A clear title of your project or initiative."
                        />

                        <TextArea
                            label="Project Description"
                            maxLength={500}
                            value={descInput}
                            onChange={(e) => setDescInput(e.target.value)}
                            hint="Explain goals and skills needed."
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select
                                label="Category"
                                options={[
                                    { value: 'personal', label: 'Personal Project' },
                                    { value: 'hackathon', label: 'Hackathon' },
                                    { value: 'academic', label: 'Academic' },
                                ]}
                            />
                            <TextField
                                label="With Error"
                                error="This field has an error state."
                                value="Invalid value"
                                onChange={() => { }}
                            />
                        </div>
                    </FormSection>
                </Card>

                {/* Custom Indicators */}
                <Card>
                    <h2 className="text-lg font-bold font-display text-text mb-4">Capacity & Deadlines</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                        <div>
                            <p className="text-xs text-muted mb-2 font-medium">SlotDots (Interactive):</p>
                            <div className="flex items-center gap-4">
                                <SlotDots filled={slots} total={4} />
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => setSlots(Math.max(0, slots - 1))}>-</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setSlots(Math.min(4, slots + 1))}>+</Button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-muted mb-2 font-medium">DeadlineRing Variants:</p>
                            <div className="flex flex-col gap-2">
                                <DeadlineRing deadline={new Date(Date.now() + 86400000 * 6).toISOString()} />
                                <DeadlineRing deadline={new Date(Date.now() + 86400000 * 2).toISOString()} />
                                <DeadlineRing deadline={new Date(Date.now() - 86400000).toISOString()} />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Empty State & Skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EmptyState
                        title="No Applications Found"
                        description="You haven't submitted any applications to collaborate yet."
                        action={<Button variant="primary">Explore Projects</Button>}
                    />

                    <Card className="space-y-3">
                        <p className="text-xs text-muted font-medium">Skeletons:</p>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-10 w-28 mt-4" />
                    </Card>
                </div>

                {/* Pagination */}
                <Card>
                    <h2 className="text-lg font-bold font-display text-text mb-4">Pagination</h2>
                    <Pagination links={dummyLinks} />
                </Card>

                {/* Confirm Dialog */}
                <ConfirmDialog
                    show={confirmOpen}
                    title="Confirm Component Action"
                    content="This modal dialog uses our locked surface tokens and accessible focus containment."
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => setConfirmOpen(false)}
                />
            </div>
        </AuthenticatedLayout>
    );
}