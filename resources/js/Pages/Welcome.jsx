import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { fadeUp, stagger } from '@/lib/motion';
import Button from '@/Components/ui/Button';
import Card from '@/Components/ui/Card';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    Sparkles,
    Users,
    Award,
    ArrowRight,
    ArrowUpRight,
    Cpu,
    Layers,
    Compass,
    CheckCircle2,
    Star,
    ShieldCheck,
    MessageSquare,
    ChevronRight,
} from 'lucide-react';

export default function Welcome({ auth }) {
    const steps = [
        {
            num: '01',
            icon: <Cpu className="w-5 h-5 text-blue-600" />,
            title: 'Post or Discover',
            description:
                'Publish your project drafts, hackathon initiatives, or architectural designs. Browse recruiting teams filtered by AAU department and verified required skills.',
        },
        {
            num: '02',
            icon: <Layers className="w-5 h-5 text-blue-600" />,
            title: 'Apply & Connect',
            description:
                'Apply to projects that fit your capacity with a structured note. Creators inspect verified profiles, approve collaborators, and initiate direct coordination via Telegram.',
        },
        {
            num: '03',
            icon: <Compass className="w-5 h-5 text-blue-600" />,
            title: 'Certify & Record',
            description:
                'Upon project completion, creators certify contributing members. Confirmed credits establish an immutable, verifiable technical record on student profiles.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F5] text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white">
            <Head title="ProjectNode - AAU Student Project Network" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#FAF9F5]/85 backdrop-blur-md border-b border-neutral-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center shadow-xs">
                            <ApplicationLogo className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-base tracking-tight text-neutral-950 flex items-center">
                            PROJECT<span className="text-blue-600">NODE</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-1 inline-block"></span>
                        </span>
                    </div>

                    {/* Nav Items */}
                    <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        <a href="#scale" className="hover:text-neutral-900 transition-colors">Features</a>
                        <a href="#community" className="hover:text-neutral-900 transition-colors">Community</a>
                        <a href="#how-it-works" className="hover:text-neutral-900 transition-colors">How It Works</a>
                        <span className="text-neutral-300">/</span>
                        <span className="text-neutral-400 font-mono text-[11px]">AAU CAMPUS NODE</span>
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
                                    Start Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 space-y-24 sm:space-y-32">
                {/* 1. HERO SECTION: Human, Editorial, Photographic */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* Left: Headline & Actions */}
                        <motion.div
                            className="lg:col-span-6 space-y-6 text-left"
                            initial="hidden"
                            animate="show"
                            variants={fadeUp}
                        >
                            {/* Pill Banner */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-xs text-xs font-medium text-neutral-700">
                                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse" />
                                <span className="font-semibold text-neutral-900">Addis Ababa University</span>
                                <span className="text-neutral-300">|</span>
                                <span className="text-blue-600 font-medium">Student Project Network</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-6xl font-bold font-display text-neutral-950 tracking-tight leading-[1.08]">
                                Where ambitious students build the future together.
                            </h1>

                            {/* Subtitle */}
                            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl">
                                ProjectNode connects AAU creators, engineers, and researchers to build real initiatives, form multidisciplinary teams, and earn tamper-proof completion credits.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                {auth?.user ? (
                                    <Button href={route('dashboard')} size="lg" variant="primary">
                                        Open Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                                    </Button>
                                ) : (
                                    <>
                                        <Button href={route('register')} size="lg" variant="primary">
                                            Join with AAU Email <ArrowRight className="w-4 h-4 ml-1.5" />
                                        </Button>
                                        <Button href={route('projects.index')} size="lg" variant="secondary">
                                            Explore Projects
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Social Proof Avatars */}
                            <div className="pt-6 flex items-center gap-4 text-xs text-neutral-500">
                                <div className="flex -space-x-2">
                                    <img
                                        src="/images/hero-portrait.jpg"
                                        alt="AAU Student"
                                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
                                    />
                                    <img
                                        src="/images/hero-circle.jpg"
                                        alt="AAU Student"
                                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
                                    />
                                    <img
                                        src="/images/student-coding.jpg"
                                        alt="AAU Student"
                                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
                                    />
                                </div>
                                <span className="font-medium text-neutral-700">
                                    Over <strong className="font-semibold text-neutral-900">500+</strong> AAU students collaborating across campus
                                </span>
                            </div>
                        </motion.div>

                        {/* Right: Asymmetrical Photo Composition */}
                        <motion.div
                            className="lg:col-span-6 relative"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="relative mx-auto max-w-lg lg:max-w-none">
                                {/* Large Hero Photograph */}
                                <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 bg-neutral-100 aspect-[4/3] relative">
                                    <img
                                        src="/images/hero-collaborate.jpg"
                                        alt="AAU students collaborating around a laptop"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs font-semibold">Autonomous Drone Mapping</div>
                                            <div className="text-[11px] text-neutral-200">Electrical & Software Engineering &bull; 2 slots left</div>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                                            Recruiting
                                        </span>
                                    </div>
                                </div>

                                {/* Floating Asymmetric Circular Cutout Photo */}
                                <div className="absolute -bottom-8 -left-6 sm:-left-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#FAF9F5] shadow-xl">
                                    <img
                                        src="/images/hero-circle.jpg"
                                        alt="Students talking on campus"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Floating Editorial Badge */}
                                <div className="absolute -top-6 -right-4 sm:-right-6 bg-white rounded-2xl p-4 shadow-xl border border-neutral-200/80 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-neutral-900">Verified Credit Sealed</div>
                                        <div className="text-[11px] text-neutral-500 font-mono">Immutable technical proof</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 2. FROM START TO SCALE: 3-Card Feature Section Inspired by Screenshot 1 */}
                <section id="scale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
                        <div>
                            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 block mb-2">
                                Collaborative Platform
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-bold font-display text-neutral-950 tracking-tight">
                                from start to scale
                            </h2>
                        </div>
                        <Button href={route('register')} variant="primary" size="md">
                            Start Now <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                    </div>

                    {/* 3 Editorial Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {/* Card 1: Warm Terracotta */}
                        <div className="space-y-4">
                            <div className="bg-[#B8573D] text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[340px] shadow-sm">
                                {/* Inner Card Mockup */}
                                <div className="bg-white/95 text-neutral-900 rounded-2xl p-4 shadow-lg space-y-3 relative z-10 backdrop-blur-xs">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-neutral-900">Multidisciplinary Team</span>
                                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                                            ACTIVE
                                        </span>
                                    </div>
                                    <div className="rounded-xl overflow-hidden aspect-[16/9]">
                                        <img
                                            src="/images/team-brainstorm.jpg"
                                            alt="Team brainstorming"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1 pt-1">
                                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700">UI/UX</span>
                                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700">Embedded C</span>
                                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700">AI Model</span>
                                    </div>
                                </div>
                                <div className="pt-4 text-white/90 text-xs font-mono tracking-wider uppercase">
                                    Step 01 &bull; Team Assembly
                                </div>
                            </div>
                            <div className="space-y-2 px-1">
                                <h3 className="text-xl font-bold font-display text-neutral-900">
                                    Find your dream team
                                </h3>
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    Connect with fellow AAU students across departments with complementary skills. Apply with a single click and coordinate directly on Telegram.
                                </p>
                                <div className="pt-1">
                                    <Link
                                        href={route('projects.index')}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:text-blue-600 transition-colors"
                                    >
                                        <span>Explore Projects</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Soft Periwinkle Blue */}
                        <div className="space-y-4">
                            <div className="bg-[#6C88EC] text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[340px] shadow-sm">
                                {/* Inner Card Mockup */}
                                <div className="bg-white/95 text-neutral-900 rounded-2xl p-4 shadow-lg space-y-3 relative z-10 backdrop-blur-xs">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 text-xs font-mono text-neutral-700">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span>projectnode.aau/mesh-nodes</span>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 text-neutral-800 space-y-2">
                                        <div className="text-xs font-bold font-display">Campus Mesh Node Architecture</div>
                                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-600">
                                            <span>Duration: 6 weeks</span>
                                            <span className="text-blue-700 font-semibold">10 hrs/week</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs pt-1">
                                        <span className="text-neutral-500 font-mono text-[11px]">3 of 4 slots filled</span>
                                        <span className="font-semibold text-emerald-600 text-[11px]">Recruiting Open</span>
                                    </div>
                                </div>
                                <div className="pt-4 text-white/90 text-xs font-mono tracking-wider uppercase">
                                    Step 02 &bull; Project Blueprint
                                </div>
                            </div>
                            <div className="space-y-2 px-1">
                                <h3 className="text-xl font-bold font-display text-neutral-900">
                                    Launch with confidence
                                </h3>
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    Create structured project blueprints with clear roles, deadlines, and weekly commitments. Review applicant profiles and build momentum fast.
                                </p>
                                <div className="pt-1">
                                    <Link
                                        href={route('projects.create')}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:text-blue-600 transition-colors"
                                    >
                                        <span>Create a Project</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Deep Forest Green */}
                        <div className="space-y-4">
                            <div className="bg-[#0D3B2E] text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[340px] shadow-sm">
                                {/* Inner Card Mockup */}
                                <div className="bg-white/95 text-neutral-900 rounded-2xl p-4 shadow-lg space-y-3 relative z-10 backdrop-blur-xs">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-bold text-neutral-900">Verified Project Credential</div>
                                        <div className="flex text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-xl overflow-hidden aspect-[16/9]">
                                        <img
                                            src="/images/student-coding.jpg"
                                            alt="Student coding and building"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-mono text-neutral-600 pt-1">
                                        <span>Signed by Creator</span>
                                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                                            <ShieldCheck className="w-3.5 h-3.5" /> Immutable
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-4 text-white/90 text-xs font-mono tracking-wider uppercase">
                                    Step 03 &bull; Verified Portfolio
                                </div>
                            </div>
                            <div className="space-y-2 px-1">
                                <h3 className="text-xl font-bold font-display text-neutral-900">
                                    Grow your presence
                                </h3>
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    Earn certified completion credits signed by project leads. Turn your campus contributions into an undeniable record of real engineering work.
                                </p>
                                <div className="pt-1">
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:text-blue-600 transition-colors"
                                    >
                                        <span>Start Building</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. COMMUNITY STORYTELLING SECTION Inspired by Screenshot 2 ("Take the leap like millions before you") */}
                <section id="community" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-8 sm:p-14 shadow-card space-y-12 relative overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left: Asymmetric Photo Pill */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/5] relative">
                                    <img
                                        src="/images/lab-discussion.jpg"
                                        alt="Students in laboratory discussion"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-medium text-neutral-800 shadow-xs flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span>aau.eiabc.arch</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Bold Headline and Link */}
                            <div className="lg:col-span-4 text-center space-y-6">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mx-auto shadow-xl border-4 border-white">
                                    <img
                                        src="/images/hero-circle.jpg"
                                        alt="AAU community circle"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-bold font-display text-blue-900 tracking-tight leading-tight">
                                    Take the leap like AAU innovators before you
                                </h2>
                                <div>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-1.5 text-base font-bold text-neutral-900 hover:text-blue-600 border-b-2 border-neutral-900 hover:border-blue-600 pb-0.5 transition-colors"
                                    >
                                        <span>Start Now</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Portrait of Student Creator */}
                            <div className="lg:col-span-4">
                                <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/5] relative">
                                    <img
                                        src="/images/hero-portrait.jpg"
                                        alt="Student builder portrait"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xs text-xs">
                                        <div className="font-bold text-neutral-900">&ldquo;ProjectNode helped me find 3 teammates in 48 hours.&rdquo;</div>
                                        <div className="text-[11px] text-neutral-500 font-mono mt-0.5">Software Engineering &bull; 4th Year</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. HOW IT WORKS 3-PHASE BREAKDOWN */}
                <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200/80 pb-6 gap-4">
                        <div>
                            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 block mb-1">
                                Operational Architecture
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold font-display text-neutral-950 tracking-tight">
                                How It Works
                            </h2>
                        </div>
                        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                            Verified Execution &bull; 3 Structured Phases
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((step, idx) => (
                            <Card key={idx} hover className="h-full flex flex-col p-7 space-y-4 bg-white border border-neutral-200/80 shadow-card">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                        {step.icon}
                                    </div>
                                    <span className="font-mono text-xs font-bold text-neutral-400">
                                        {step.num}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold font-display text-neutral-950">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                                    {step.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 5. CALLOUT SECTION Inspired by Screenshot 3 ("It's more than a website. It's your future.") */}
                <section className="bg-gradient-to-b from-[#EAEFFD] via-[#F0F4FE] to-[#FAF9F5] py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-100/80 text-center space-y-6">
                            <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-600 block">
                                PROJECTNODE
                            </span>

                            <h2 className="text-3xl sm:text-5xl font-bold font-display text-neutral-950 tracking-tight leading-tight">
                                It&apos;s more than a project. <br />
                                It&apos;s your future.
                            </h2>

                            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                                Join the official AAU student network. Build real products, publish initiatives, and connect with ambitious peers today.
                            </p>

                            {/* Email Action Bar */}
                            <div className="pt-2">
                                {auth?.user ? (
                                    <Button href={route('dashboard')} size="lg" variant="primary">
                                        Go to Your Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                                    </Button>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                                        <input
                                            type="text"
                                            readOnly
                                            value="student@aau.edu.et"
                                            className="w-full sm:w-auto flex-1 px-4 py-3 rounded-full bg-neutral-50 border border-neutral-200 text-neutral-400 text-xs font-mono select-none"
                                        />
                                        <Button href={route('register')} size="lg" variant="primary" className="w-full sm:w-auto shrink-0">
                                            Start Now <ArrowRight className="w-4 h-4 ml-1.5" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs font-mono text-neutral-400">
                                Exclusively for Addis Ababa University students. Free forever.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-200/80 py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center shadow-xs">
                            <ApplicationLogo className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-neutral-900">ProjectNode</span>
                        <span>&bull;</span>
                        <span>Addis Ababa University</span>
                    </div>
                    <div className="flex items-center gap-6 font-medium">
                        <Link href={route('projects.index')} className="hover:text-neutral-900 transition-colors">
                            Explore Projects
                        </Link>
                        <a href="#how-it-works" className="hover:text-neutral-900 transition-colors">
                            Workflow
                        </a>
                        <Link href={route('login')} className="hover:text-neutral-900 transition-colors">
                            Log In
                        </Link>
                        <Link href={route('register')} className="hover:text-neutral-900 transition-colors">
                            Register
                        </Link>
                    </div>
                    <div className="font-mono text-[11px] text-neutral-400">
                        &copy; {new Date().getFullYear()} AAU Campus Node
                    </div>
                </div>
            </footer>
        </div>
    );
}
