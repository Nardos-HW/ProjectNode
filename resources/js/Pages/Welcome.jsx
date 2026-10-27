import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to ProjectNode" />

            <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
                {/* Navigation */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold tracking-tight text-indigo-600">
                                ProjectNode
                            </span>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                AAU
                            </span>
                        </div>

                        <nav className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="text-sm font-semibold text-gray-700 hover:text-indigo-600"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-semibold text-gray-700 hover:text-indigo-600"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-grow">
                    {/* Hero Section */}
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            Find Collaborators. Build Projects at AAU.
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                            ProjectNode is a student-only project matching platform for Addis Ababa University.
                            Discover active projects, team up with peers across departments, and turn ideas into working software.
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                    >
                                        Get Started with AAU Email
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
                                    >
                                        Log in <span aria-hidden="true">→</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="bg-white py-16 border-y border-gray-200">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold tracking-tight text-center text-gray-900 mb-12">
                                How It Works
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-6 rounded-lg border border-gray-100 bg-gray-50">
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-4">
                                        1
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Post or Find
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Share your project idea with required skills and available openings, or browse active listings published by fellow students.
                                    </p>
                                </div>

                                <div className="p-6 rounded-lg border border-gray-100 bg-gray-50">
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-4">
                                        2
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Request to Join
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Apply to collaborate on ideas that match your skill set. Project owners review applications directly on the platform.
                                    </p>
                                </div>

                                <div className="p-6 rounded-lg border border-gray-100 bg-gray-50">
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-4">
                                        3
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Build Your Record
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Form your team, coordinate via secure contact info, and keep a verified history of completed collaborative projects.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About ProjectNode</h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            ProjectNode is built specifically for Addis Ababa University students. Many ambitious students have ideas but lack teammates with complementary skill sets, while others want to build practical software but have no team. Access requires an authenticated university account to ensure all collaborators are verified peers.
                        </p>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
                    ProjectNode &bull; Addis Ababa University Student Collaboration
                </footer>
            </div>
        </>
    );
}