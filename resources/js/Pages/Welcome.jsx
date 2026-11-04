import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { fadeUp, stagger, hoverLift } from '@/lib/motion';
import Button from '@/Components/ui/Button';
import Card from '@/Components/ui/Card';
import { Sparkles, Users, Award, ArrowRight } from 'lucide-react';

export default function Welcome({ auth }) {
    const steps = [
        {
            icon: <Sparkles className="w-6 h-6 text-violet" />,
            title: '1. Post or find',
            description:
                'Publish your project ideas, hackathons, assignments, or campus initiatives. Browse recruiting projects filtered by department and required skills.',
        },
        {
            icon: <Users className="w-6 h-6 text-mint" />,
            title: '2. Request to join',
            description:
                'Apply to projects that fit your skills and availability with a personal note. Owners review applicants with verified profiles and accept collaborators.',
        },
        {
            icon: <Award className="w-6 h-6 text-amber" />,
            title: '3. Build your record',
            description:
                'Once your project finishes, the creator certifies contributors. Confirmed participation creates a permanent, verified project history on your profile.',
        },
    ];

    return (
        <div className="min-h-screen bg-ink text-text flex flex-col selection:bg-violet selection:text-white relative overflow-hidden">
            <Head title="Welcome to ProjectNode" />

            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-violet/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-10 w-[400px] h-[300px] bg-mint/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Navigation Header */}
            <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-20 flex items-center justify-between border-b border-surface-2/60">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet/20 border border-violet/40 flex items-center justify-center shadow-lg shadow-violet/20">
                        <span className="text-violet font-bold font-display text-base">PN</span>
                    </div>
                    <span className="font-display font-bold text-xl text-text tracking-tight">
                        ProjectNode
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {auth?.user ? (
                        <Button href={route('dashboard')} variant="primary" size="sm">
                            Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    ) : (
                        <>
                            <Button href={route('login')} variant="ghost" size="sm">
                                Log In
                            </Button>
                            <Button href={route('register')} variant="primary" size="sm">
                                Register
                            </Button>
                        </>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">
                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <motion.div
                        className="lg:col-span-7 space-y-6"
                        initial="hidden"
                        animate="show"
                        variants={fadeUp}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-surface-2/80 text-xs font-medium text-muted">
                            <span className="w-2 h-2 rounded-full bg-mint" />
                            Exclusively for Addis Ababa University Students
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-[1.1] text-text">
                            Find teammates. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet via-text to-mint">
                                Build real projects.
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
                            A focused collaboration space for verified AAU students to publish ideas, find collaborators across departments, coordinate on Telegram, and build a verified record of work.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            {auth?.user ? (
                                <Button href={route('dashboard')} size="lg" variant="primary">
                                    Open Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button href={route('register')} size="lg" variant="primary">
                                        Register with AAU Email
                                    </Button>
                                    <Button href={route('login')} size="lg" variant="secondary">
                                        Log In
                                    </Button>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Animated Constellation Illustration */}
                    <div className="lg:col-span-5 flex justify-center">
                        <motion.div
                            className="relative w-72 h-72 sm:w-88 sm:h-88"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <svg
                                viewBox="0 0 300 300"
                                className="w-full h-full drop-shadow-2xl"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Glowing ambient background circle */}
                                <circle cx="150" cy="150" r="120" className="fill-surface/60 stroke-surface-2" strokeWidth="1" />

                                {/* Connecting constellation lines */}
                                <line x1="70" y1="80" x2="150" y2="50" stroke="#7C5CFF" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.6" />
                                <line x1="150" y1="50" x2="230" y2="100" stroke="#7C5CFF" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.6" />
                                <line x1="70" y1="80" x2="100" y2="210" stroke="#7C5CFF" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.6" />
                                <line x1="150" y1="50" x2="150" y2="150" stroke="#3DDBA4" strokeWidth="2" strokeOpacity="0.8" />
                                <line x1="150" y1="150" x2="100" y2="210" stroke="#3DDBA4" strokeWidth="2" strokeOpacity="0.8" />
                                <line x1="150" y1="150" x2="220" y2="220" stroke="#FFB84D" strokeWidth="2" strokeOpacity="0.8" />
                                <line x1="230" y1="100" x2="220" y2="220" stroke="#7C5CFF" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.6" />

                                {/* Constellation Node Circles */}
                                <circle cx="150" cy="150" r="10" className="fill-violet" />
                                <circle cx="150" cy="150" r="18" className="stroke-violet/40" strokeWidth="2" />

                                <circle cx="70" cy="80" r="6" className="fill-mint" />
                                <circle cx="150" cy="50" r="7" className="fill-amber" />
                                <circle cx="230" cy="100" r="6" className="fill-violet" />
                                <circle cx="100" cy="210" r="7" className="fill-mint" />
                                <circle cx="220" cy="220" r="6" className="fill-coral" />
                            </svg>
                        </motion.div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="space-y-8">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold font-display text-text">
                            How It Works
                        </h2>
                        <p className="text-sm text-muted">
                            A straightforward three-step process built around student collaboration.
                        </p>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={stagger(0.12)}
                    >
                        {steps.map((step, idx) => (
                            <motion.div key={idx} variants={fadeUp}>
                                <Card hover className="h-full flex flex-col p-6 space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center border border-surface-2/80">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-lg font-bold font-display text-text">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-muted leading-relaxed flex-1">
                                        {step.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* About Section */}
                <section className="p-8 sm:p-12 rounded-2xl bg-surface border border-surface-2 space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-text">
                        About ProjectNode
                    </h2>
                    <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
                        ProjectNode is an open project discovery platform built specifically for students at Addis Ababa University. Instead of scattered social media groups or bulletin boards, ProjectNode centralizes student initiatives, team recruiting, and completed project history in one university-verified environment. Direct team coordination takes place on Telegram once applications are accepted, keeping platform interactions simple, focused, and secure.
                    </p>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-surface-2 py-8 mt-12 bg-surface/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
                    <p>ProjectNode &bull; Addis Ababa University</p>
                    <p>Designed for student collaboration</p>
                </div>
            </footer>
        </div>
    );
}