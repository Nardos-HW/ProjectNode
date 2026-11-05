import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { fadeUp, stagger } from '@/lib/motion';
import Button from '@/Components/ui/Button';
import Card from '@/Components/ui/Card';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Sparkles, Users, Award, ArrowRight, ArrowUpRight, Cpu, Layers, Compass, ChevronDown, Terminal, CheckCircle2 } from 'lucide-react';

function ArchitecturalBlueprintWireframe({ className = '' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 800 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="400" cy="300" r="280" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <circle cx="400" cy="300" r="210" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="400" cy="300" r="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="400" cy="300" r="70" stroke="rgba(255,77,0,0.22)" strokeWidth="1" />
            <circle cx="260" cy="300" r="140" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <circle cx="540" cy="300" r="140" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <line x1="50" y1="300" x2="750" y2="300" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 6" />
            <line x1="400" y1="20" x2="400" y2="580" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 6" />
            <line x1="190" y1="90" x2="610" y2="510" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="190" y1="510" x2="610" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <circle cx="400" cy="300" r="3" fill="#FF4D00" />
            <circle cx="400" cy="90" r="2" fill="rgba(255,255,255,0.3)" />
            <circle cx="400" cy="510" r="2" fill="rgba(255,255,255,0.3)" />
            <circle cx="190" cy="300" r="2" fill="rgba(255,255,255,0.3)" />
            <circle cx="610" cy="300" r="2" fill="rgba(255,255,255,0.3)" />
        </svg>
    );
}

function TechnicalTrussWireframe({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="110" x2="220" y2="110" stroke="#FF4D00" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="40" y1="35" x2="200" y2="35" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="40" y1="35" x2="20" y2="110" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="200" y1="35" x2="220" y2="110" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="40" y1="35" x2="80" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="80" y1="110" x2="120" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="120" y1="35" x2="160" y2="110" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="160" y1="110" x2="200" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <circle cx="40" cy="35" r="2.5" fill="#FF4D00" />
            <circle cx="120" cy="35" r="2.5" fill="#FF4D00" />
            <circle cx="200" cy="35" r="2.5" fill="#FF4D00" />
            <circle cx="20" cy="110" r="2.5" fill="#FFFFFF" />
            <circle cx="80" cy="110" r="2.5" fill="#FFFFFF" />
            <circle cx="160" cy="110" r="2.5" fill="#FFFFFF" />
            <circle cx="220" cy="110" r="2.5" fill="#FFFFFF" />
        </svg>
    );
}

function TechnicalDomeWireframe({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="120" cy="110" rx="90" ry="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 30 110 C 30 50, 210 50, 210 110" stroke="#FF4D00" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
            <path d="M 50 110 C 50 65, 190 65, 190 110" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
            <line x1="120" y1="50" x2="120" y2="110" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="75" y1="72" x2="120" y2="110" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="165" y1="72" x2="120" y2="110" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <circle cx="120" cy="50" r="3" fill="#FF4D00" />
        </svg>
    );
}

function TechnicalGridWireframe({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 30 40 L 120 20 L 210 40 L 120 60 Z" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <path d="M 30 40 L 30 100 L 120 120 L 120 60 Z" stroke="#FF4D00" strokeWidth="1.2" strokeOpacity="0.8" />
            <path d="M 210 40 L 210 100 L 120 120 L 120 60 Z" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="30" y1="70" x2="120" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="120" y1="90" x2="210" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="120" cy="20" r="2.5" fill="#FF4D00" />
            <circle cx="120" cy="120" r="2.5" fill="#FF4D00" />
        </svg>
    );
}

export default function Welcome({ auth }) {
    const steps = [
        {
            num: '01',
            icon: <Cpu className="w-5 h-5 text-flame-500" />,
            title: 'Post or Discover',
            description:
                'Publish your project drafts, hackathon initiatives, or architectural designs. Browse recruiting teams filtered by AAU department and verified required skills.',
        },
        {
            num: '02',
            icon: <Layers className="w-5 h-5 text-flame-500" />,
            title: 'Apply & Connect',
            description:
                'Apply to projects that fit your capacity with a structured note. Creators inspect verified profiles, approve collaborators, and initiate direct coordination via Telegram.',
        },
        {
            num: '03',
            icon: <Compass className="w-5 h-5 text-flame-500" />,
            title: 'Certify & Record',
            description:
                'Upon project completion, creators certify contributing members. Confirmed credits establish an immutable, verifiable technical record on student profiles.',
        },
    ];

    return (
        <div className="min-h-screen bg-carbon-950 text-neutral-100 flex flex-col selection:bg-flame-500 selection:text-white relative overflow-hidden cad-grid">
            <Head title="ProjectNode - AAU Technical Project Network" />

            {/* Subtle Ambient Flame Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-flame-500/5 rounded-full blur-[140px] pointer-events-none" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-carbon-950/80 backdrop-blur-md border-b border-carbon-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Minimalist Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-carbon-900 border border-carbon-800 flex items-center justify-center">
                            <ApplicationLogo className="w-5 h-5 text-flame-500" />
                        </div>
                        <span className="font-mono font-bold text-xs tracking-widest text-white uppercase flex items-center">
                            PROJECT<span className="text-flame-500">NODE</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-flame-500 ml-1 inline-block"></span>
                        </span>
                    </div>

                    {/* Nav Items */}
                    <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                        <a href="#about" className="hover:text-white transition-colors">Architecture</a>
                        <span className="text-neutral-700">/</span>
                        <span className="text-neutral-500 font-mono">AAU CAMPUS NODE</span>
                    </nav>

                    {/* Action CTA */}
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Button href={route('dashboard')} variant="primary" size="sm">
                                Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        ) : (
                            <>
                                <Button href={route('login')} variant="ghost" size="sm">
                                    Log In
                                </Button>
                                <Button href={route('register')} variant="primary" size="sm">
                                    Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">
                {/* Hero Section */}
                <section className="relative flex flex-col items-center text-center justify-center min-h-[520px] py-12">
                    {/* Architectural Wireframe Circles in Hero Background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                        <ArchitecturalBlueprintWireframe className="w-full max-w-4xl h-full" />
                    </div>

                    <motion.div
                        className="relative z-10 space-y-8 max-w-3xl flex flex-col items-center"
                        initial="hidden"
                        animate="show"
                        variants={fadeUp}
                    >
                        {/* Mini Pill Banner */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-carbon-900 border border-carbon-800 text-xs font-mono uppercase tracking-wider text-neutral-300 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-flame-500 inline-block animate-pulse" />
                            <span>AAU Student Network</span>
                            <span className="text-neutral-600 font-mono">/</span>
                            <span className="text-flame-500 font-semibold flex items-center gap-1">
                                GET STARTED <ArrowRight className="w-3 h-3" />
                            </span>
                        </div>

                        {/* Stark High-Impact Headline */}
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.05]">
                            Nothing new to see here.
                            <span className="block text-xl sm:text-3xl lg:text-4xl font-normal text-neutral-400 mt-3 font-sans tracking-normal">
                                Until student architects start building.
                            </span>
                        </h1>

                        {/* Refactory Subtitle */}
                        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed font-sans">
                            ProjectNode transforms student ambition into verified real-world projects, objects, and installations across Addis Ababa University. Find collaborators, coordinate directly on Telegram, and build an authentic record of work.
                        </p>

                        {/* Call To Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            {auth?.user ? (
                                <Button href={route('dashboard')} size="lg" variant="primary">
                                    Open Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Button>
                            ) : (
                                <>
                                    <Button href={route('register')} size="lg" variant="primary">
                                        Register with AAU Email <ArrowRight className="w-4 h-4 ml-1.5" />
                                    </Button>
                                    <Button href={route('login')} size="lg" variant="secondary">
                                        Log In
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Technical Coordinate Meta */}
                        <div className="pt-8 text-[11px] font-mono text-neutral-600 uppercase tracking-widest flex items-center gap-4">
                            <span>LAT 9.0401° N</span>
                            <span>&bull;</span>
                            <span>LON 38.7618° E</span>
                            <span>&bull;</span>
                            <span>AAU CAMPUS NODE-01</span>
                        </div>

                        {/* Refactory Scroll To Begin Indicator */}
                        <a href="#featured" className="pt-6 flex flex-col items-center gap-2 group text-neutral-500 hover:text-white transition-colors cursor-pointer">
                            <span className="font-mono text-[10px] uppercase tracking-[0.25em]">SCROLL TO BEGIN</span>
                            <ChevronDown className="w-3.5 h-3.5 text-flame-500 animate-bounce" />
                        </a>
                    </motion.div>
                </section>

                {/* Featured Projects Blueprint Showcase (Refactory "Our Featured Projects" Section) */}
                <section id="featured" className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-carbon-800 pb-4 gap-4">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-widest text-flame-500 block mb-1">
                                // Selected Blueprints
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                                Our Featured Projects
                            </h2>
                        </div>
                        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                            Active Campus Node Drafts &bull; AAU 2026/27
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card hover className="p-6 space-y-4 cad-crosshairs flex flex-col justify-between group">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                                    <span className="text-flame-500 font-semibold">[AAU-SE-04]</span>
                                    <span className="px-2 py-0.5 rounded bg-flame-500/10 text-flame-500 border border-flame-500/30">2 SLOTS LEFT</span>
                                </div>
                                <div className="h-36 rounded-lg bg-carbon-950 border border-carbon-800/80 flex items-center justify-center relative overflow-hidden group-hover:border-neutral-700 transition-colors">
                                    <div className="absolute inset-0 cad-grid opacity-30" />
                                    <TechnicalGridWireframe className="w-36 h-28 relative z-10" />
                                </div>
                                <h3 className="text-lg font-bold font-display text-white group-hover:text-flame-500 transition-colors">
                                    Distributed Mesh Node
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    Decentralized peer-to-peer campus transmission nodes for resilient offline AAU academic material distribution.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-carbon-800 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase">
                                <span>EiABC &bull; Electrical Eng</span>
                                <span className="text-neutral-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">VIEW SPEC &rarr;</span>
                            </div>
                        </Card>

                        <Card hover className="p-6 space-y-4 cad-crosshairs flex flex-col justify-between group">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                                    <span className="text-flame-500 font-semibold">[AAU-ARC-12]</span>
                                    <span className="px-2 py-0.5 rounded bg-flame-500/10 text-flame-500 border border-flame-500/30">1 SLOT LEFT</span>
                                </div>
                                <div className="h-36 rounded-lg bg-carbon-950 border border-carbon-800/80 flex items-center justify-center relative overflow-hidden group-hover:border-neutral-700 transition-colors">
                                    <div className="absolute inset-0 cad-grid opacity-30" />
                                    <TechnicalTrussWireframe className="w-36 h-28 relative z-10" />
                                </div>
                                <h3 className="text-lg font-bold font-display text-white group-hover:text-flame-500 transition-colors">
                                    Cantilever Bamboo Pavilion
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    Parametric architectural canopy study utilizing Ethiopian highland bamboo composites and tensegrity joints.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-carbon-800 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase">
                                <span>Architecture &bull; Structural</span>
                                <span className="text-neutral-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">VIEW SPEC &rarr;</span>
                            </div>
                        </Card>

                        <Card hover className="p-6 space-y-4 cad-crosshairs flex flex-col justify-between group">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                                    <span className="text-flame-500 font-semibold">[AAU-ROB-07]</span>
                                    <span className="px-2 py-0.5 rounded bg-flame-500/10 text-flame-500 border border-flame-500/30">RECRUITING</span>
                                </div>
                                <div className="h-36 rounded-lg bg-carbon-950 border border-carbon-800/80 flex items-center justify-center relative overflow-hidden group-hover:border-neutral-700 transition-colors">
                                    <div className="absolute inset-0 cad-grid opacity-30" />
                                    <TechnicalDomeWireframe className="w-36 h-28 relative z-10" />
                                </div>
                                <h3 className="text-lg font-bold font-display text-white group-hover:text-flame-500 transition-colors">
                                    Acoustic Biomass Dome
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    Geodesic micro-climate greenhouse dome equipped with sensor telemetry and closed-loop watering arrays.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-carbon-800 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase">
                                <span>Biomedical &bull; Mechanical</span>
                                <span className="text-neutral-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">VIEW SPEC &rarr;</span>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-carbon-800 pb-4 gap-4">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-widest text-flame-500 block mb-1">
                                // Operational Workflow
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                                How It Works
                            </h2>
                        </div>
                        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                            Verified Execution &bull; 3 Structured Phases
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
                                <Card hover className="h-full flex flex-col p-6 space-y-4 cad-crosshairs">
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-lg bg-carbon-850 flex items-center justify-center border border-carbon-700">
                                            {step.icon}
                                        </div>
                                        <span className="font-mono text-xs font-bold text-neutral-600">
                                            {step.num}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold font-display text-white uppercase tracking-wide">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-neutral-400 leading-relaxed flex-1">
                                        {step.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* About / Architecture Section */}
                <section id="about" className="p-8 sm:p-12 rounded-xl bg-carbon-900 border border-carbon-800 space-y-6 cad-crosshairs">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-flame-500"></span>
                        <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wider text-white">
                            About ProjectNode
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
                        ProjectNode is an industrial-grade project discovery and collaborator network designed exclusively for verified Addis Ababa University students. Rather than relying on unstructured messaging boards or transient chat groups, ProjectNode establishes a centralized drafting room for campus initiatives, engineering projects, and research collaborations.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-carbon-800 text-xs font-mono text-neutral-400">
                        <div>
                            <span className="text-white font-bold block text-sm">AAU Verified</span>
                            <span>Restricted exclusively to validated aau.edu.et student identities.</span>
                        </div>
                        <div>
                            <span className="text-white font-bold block text-sm">Telegram Native</span>
                            <span>Direct communication coordinates on Telegram upon mutual request acceptance.</span>
                        </div>
                        <div>
                            <span className="text-white font-bold block text-sm">Verified Credentials</span>
                            <span>Immutable completion records build authentic technical portfolios.</span>
                        </div>
                    </div>
                </section>

                {/* Industrial Callout Banner (Refactory "Built from what turned up" Section) */}
                <section className="relative p-10 sm:p-16 rounded-2xl bg-carbon-900 border border-carbon-800 text-center flex flex-col items-center justify-center overflow-hidden cad-grid cad-crosshairs">
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <span className="text-xs font-mono uppercase tracking-widest text-flame-500">
                            // High-Durability Academic Records
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight leading-tight">
                            Built from student ambition.
                            <span className="block text-neutral-400">Built to last.</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                            Every accepted application, approved milestone, and confirmed project credit is sealed into a tamper-proof technical profile that endures well beyond graduation.
                        </p>
                        <div className="pt-2">
                            <Button href={route('projects.index')} variant="primary" size="md">
                                Explore Project Feed <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Refactory Bottom Pill Dock */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1 p-1.5 rounded-full bg-carbon-900/90 backdrop-blur-md border border-carbon-800 shadow-2xl text-xs font-mono">
                <div className="px-3 py-1 rounded-full bg-carbon-800 text-white font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-flame-500 animate-pulse" />
                    <span>AAU</span>
                </div>
                <a href="#featured" className="px-3 py-1 rounded-full text-neutral-400 hover:text-white transition-colors">
                    Featured
                </a>
                <a href="#how-it-works" className="px-3 py-1 rounded-full text-neutral-400 hover:text-white transition-colors">
                    Workflow
                </a>
                <a href="#about" className="px-3 py-1 rounded-full text-neutral-400 hover:text-white transition-colors">
                    Architecture
                </a>
                <Link
                    href={route('projects.index')}
                    className="px-4 py-1 rounded-full bg-flame-500 hover:bg-flame-600 text-white font-semibold flex items-center gap-1 transition-colors"
                >
                    <span>Discover Feed</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-carbon-800 py-8 mt-12 bg-carbon-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-flame-500"></span>
                        <span>PROJECTNODE &bull; ADDIS ABABA UNIVERSITY</span>
                    </div>
                    <div>ENGINEERED FOR TECHNICAL COLLABORATION</div>
                </div>
            </footer>
        </div>
    );
}
