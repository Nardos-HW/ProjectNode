import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { Shield, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function AuthenticatedLayout({ children }) {
    const { auth, chat } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(chat?.unread ?? 0);

    useEffect(() => {
        if (typeof chat?.unread === 'number') {
            setUnreadCount(chat.unread);
        }
    }, [chat?.unread]);

    useEffect(() => {
        const fetchUnread = () => {
            if (document.visibilityState !== 'visible') return;
            axios.get(route('messages.unread_count'))
                .then((res) => {
                    if (typeof res.data?.count === 'number') {
                        setUnreadCount(res.data.count);
                    }
                })
                .catch(() => {});
        };

        const interval = setInterval(fetchUnread, 30000);
        document.addEventListener('visibilitychange', fetchUnread);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', fetchUnread);
        };
    }, []);

    const navLinks = [
        { name: 'Dashboard', href: route('dashboard'), active: route().current('dashboard') },
        { name: 'Discover', href: route('projects.index'), active: route().current('projects.index') || route().current('projects.show') },
        { name: 'My Projects', href: route('projects.mine'), active: route().current('projects.mine') },
        { name: 'Applications', href: route('applications.index'), active: route().current('applications.index') },
        { name: 'Messages', href: route('messages.index'), active: route().current('messages.*'), badge: unreadCount },
    ];

    const adminLinks = [
        { name: 'Students', href: route('admin.users.index'), active: route().current('admin.users.*') },
        { name: 'Projects', href: route('admin.projects.index'), active: route().current('admin.projects.*') },
        { name: 'Audit Log', href: route('admin.audit-logs.index'), active: route().current('admin.audit-logs.*') },
    ];

    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen bg-carbon-950 text-neutral-100 cad-grid">
            <nav className="border-b border-carbon-800 bg-carbon-950/80 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <div className="shrink-0 flex items-center">
                                <Link href={route('dashboard')} className="flex items-center gap-2.5 group">
                                    <div className="w-8 h-8 rounded-lg bg-carbon-900 border border-carbon-800 flex items-center justify-center group-hover:border-flame-500/60 transition-colors">
                                        <ApplicationLogo className="w-5 h-5 text-flame-500" />
                                    </div>
                                    <div className="flex items-center tracking-widest text-xs font-bold font-mono text-white">
                                        <span>PROJECT</span>
                                        <span className="text-flame-500">NODE</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-flame-500 ml-1 inline-block"></span>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden space-x-6 sm:-my-px sm:flex items-center">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.name}
                                        href={link.href}
                                        active={link.active}
                                        className="inline-flex items-center gap-1.5"
                                    >
                                        <span>{link.name}</span>
                                        {link.badge > 0 && (
                                            <span
                                                className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-bold leading-none text-white bg-flame-500 rounded-full"
                                                aria-label={`${link.badge} unread messages`}
                                            >
                                                {link.badge}
                                            </span>
                                        )}
                                    </NavLink>
                                ))}

                                {/* Admin Dropdown (Admins Only) */}
                                {isAdmin && (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-colors ${
                                                    route().current('admin.*')
                                                        ? 'bg-flame-500/10 text-flame-500 border-flame-500/30'
                                                        : 'bg-carbon-900 text-neutral-400 hover:text-white border-carbon-800'
                                                }`}
                                            >
                                                <Shield className="w-3.5 h-3.5 text-flame-500" />
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
                                                className="inline-flex items-center px-3 py-1.5 border border-carbon-800 text-xs font-mono uppercase tracking-wider rounded-lg text-neutral-200 bg-carbon-900 hover:bg-carbon-850 hover:border-neutral-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                                                {user.name}
                                                <ChevronDown className="ms-2 -me-0.5 h-3.5 w-3.5 text-neutral-400" />
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
                                className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-carbon-850 border border-carbon-800 focus:outline-none transition duration-150 ease-in-out"
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
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-b border-carbon-800 bg-carbon-950/95 backdrop-blur-md'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <ResponsiveNavLink
                                key={link.name}
                                href={link.href}
                                active={link.active}
                                className="flex items-center justify-between"
                            >
                                <span>{link.name}</span>
                                {link.badge > 0 && (
                                    <span
                                        className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-mono font-bold text-white bg-flame-500 rounded-full"
                                        aria-label={`${link.badge} unread messages`}
                                    >
                                        {link.badge}
                                    </span>
                                )}
                            </ResponsiveNavLink>
                        ))}

                        {/* Admin Mobile Sub-links */}
                        {isAdmin && (
                            <div className="pt-2 border-t border-carbon-800">
                                <div className="px-4 py-1 text-[11px] font-bold text-flame-500 uppercase tracking-wider flex items-center gap-1.5 font-mono">
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

                    <div className="pt-4 pb-3 border-t border-carbon-800">
                        <div className="px-4">
                            <div className="font-semibold text-sm text-white">{user.name}</div>
                            <div className="font-mono text-xs text-neutral-500">{user.email}</div>
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