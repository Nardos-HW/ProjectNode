import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { Shield, ChevronDown } from 'lucide-react';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const navLinks = [
        { name: 'Dashboard', href: route('dashboard'), active: route().current('dashboard') },
        { name: 'Discover', href: route('projects.index'), active: route().current('projects.index') || route().current('projects.show') },
        { name: 'My Projects', href: route('projects.mine'), active: route().current('projects.mine') },
        { name: 'Applications', href: route('applications.index'), active: route().current('applications.index') },
    ];

    const adminLinks = [
        { name: 'Students', href: route('admin.users.index'), active: route().current('admin.users.*') },
        { name: 'Projects', href: route('admin.projects.index'), active: route().current('admin.projects.*') },
        { name: 'Audit Log', href: route('admin.audit-logs.index'), active: route().current('admin.audit-logs.*') },
    ];

    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen bg-ink text-text">
            <nav className="border-b border-surface-2 bg-surface/80 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <div className="shrink-0 flex items-center">
                                <Link href={route('dashboard')}>
                                    <ApplicationLogo className="block h-8 w-auto fill-current text-violet" />
                                </Link>
                            </div>

                            <div className="hidden space-x-6 sm:-my-px sm:flex items-center">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.name}
                                        href={link.href}
                                        active={link.active}
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}

                                {/* Admin Dropdown (Admins Only) */}
                                {isAdmin && (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${route().current('admin.*')
                                                        ? 'bg-violet/15 text-violet border-violet/30'
                                                        : 'bg-surface-2/60 text-muted hover:text-text border-surface-2'
                                                    }`}
                                            >
                                                <Shield className="w-3.5 h-3.5 text-violet" />
                                                <span>Admin</span>
                                                <ChevronDown className="w-3 h-3 opacity-60" />
                                            </button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content align="left" width="48">
                                            {adminLinks.map((item) => (
                                                <Dropdown.Link key={item.name} href={item.href}>
                                                    {item.name}
                                                </Dropdown.Link>
                                            ))}
                                        </Dropdown.Content>
                                    </Dropdown>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-surface-2 text-xs leading-4 font-medium rounded-xl text-text bg-surface hover:bg-surface-2 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}
                                                <ChevronDown className="ms-2 -me-0.5 h-3.5 w-3.5 text-muted" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('students.show', user.id)}>
                                            Public Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-xl text-muted hover:text-text hover:bg-surface-2 focus:outline-none transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-b border-surface-2 bg-surface'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <ResponsiveNavLink
                                key={link.name}
                                href={link.href}
                                active={link.active}
                            >
                                {link.name}
                            </ResponsiveNavLink>
                        ))}

                        {/* Admin Mobile Sub-links */}
                        {isAdmin && (
                            <div className="pt-2 border-t border-surface-2/60">
                                <div className="px-4 py-1 text-[11px] font-bold text-violet uppercase tracking-wider flex items-center gap-1.5">
                                    <Shield className="w-3 h-3" /> Administration
                                </div>
                                {adminLinks.map((item) => (
                                    <ResponsiveNavLink key={item.name} href={item.href} active={item.active}>
                                        {item.name}
                                    </ResponsiveNavLink>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-surface-2">
                        <div className="px-4">
                            <div className="font-medium text-base text-text">{user.name}</div>
                            <div className="font-medium text-xs text-muted">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile Settings</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('students.show', user.id)}>Public Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}