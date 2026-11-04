import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import Toast from '@/Components/ui/Toast';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', href: route('dashboard'), active: route().current('dashboard') },
        { name: 'Discover', href: route('projects.index'), active: route().current('projects.index') || route().current('projects.show') },
        { name: 'My Projects', href: route('projects.mine'), active: route().current('projects.mine') },
        { name: 'Applications', href: route('applications.index'), active: route().current('applications.index') },
    ];

    return (
        <div className="min-h-screen bg-ink text-text flex flex-col selection:bg-violet selection:text-white">
            {/* Top Navigation Bar */}
            <nav className="bg-surface/90 backdrop-blur-md border-b border-surface-2 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left: Brand & Nav Links */}
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')} className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-xl bg-violet/20 border border-violet/40 flex items-center justify-center group-hover:border-violet transition-colors">
                                    <span className="text-violet font-bold font-display text-sm">PN</span>
                                </div>
                                <span className="font-display font-bold text-lg text-text tracking-tight group-hover:text-violet transition-colors">
                                    ProjectNode
                                </span>
                            </Link>

                            <div className="hidden sm:flex items-center gap-1">
                                {navLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${item.active
                                            ? 'bg-surface-2 text-text border border-surface-2'
                                            : 'text-muted hover:text-text hover:bg-surface-2/50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right: User Menu */}
                        <div className="hidden sm:flex sm:items-center sm:gap-3">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-text bg-surface-2/60 border border-surface-2 hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet"
                                >
                                    <span className="font-medium">{auth.user.name}</span>
                                    <ChevronDown className={`w-4 h-4 text-muted transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {userDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setUserDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface border border-surface-2 shadow-xl shadow-black/40 py-1.5 z-20">
                                            <Link
                                                href={route('profile.edit')}
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors"
                                            >
                                                <UserIcon className="w-4 h-4 text-muted" />
                                                Profile Settings
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-coral hover:bg-coral/10 transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4 text-coral" />
                                                Log Out
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Hamburger */}
                        <div className="flex items-center sm:hidden">
                            <button
                                type="button"
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="p-2 rounded-xl text-muted hover:text-text hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-violet"
                                aria-label="Toggle navigation menu"
                            >
                                {showingNavigationDropdown ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden border-t border-surface-2 bg-surface px-4 pt-2 pb-4 space-y-1">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setShowingNavigationDropdown(false)}
                                className={`block px-3 py-2 rounded-xl text-sm font-medium ${item.active
                                    ? 'bg-surface-2 text-text'
                                    : 'text-muted hover:text-text hover:bg-surface-2/50'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-3 mt-3 border-t border-surface-2 space-y-1">
                            <div className="px-3 py-1 text-xs text-muted font-medium">
                                Signed in as <span className="text-text">{auth.user.name}</span>
                            </div>
                            <Link
                                href={route('profile.edit')}
                                onClick={() => setShowingNavigationDropdown(false)}
                                className="block px-3 py-2 rounded-xl text-sm text-muted hover:text-text hover:bg-surface-2/50"
                            >
                                Profile Settings
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setShowingNavigationDropdown(false)}
                                className="w-full block px-3 py-2 rounded-xl text-sm text-coral hover:bg-coral/10 text-left"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Optional Header Banner */}
            {header && (
                <header className="bg-surface/50 border-b border-surface-2/70 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Page Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Global Notification Toast */}
            <Toast />
        </div>
    );
}