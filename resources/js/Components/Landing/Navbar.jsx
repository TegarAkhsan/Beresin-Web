import { Link } from '@inertiajs/react';

export default function Navbar({ auth, canLogin, canRegister }) {
    return (
        <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
                    Beresin.
                </div>
                <div className="flex items-center gap-6">
                    {canLogin && (
                        <>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition font-medium text-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-slate-300 hover:text-white transition font-medium"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition font-medium shadow-lg shadow-indigo-500/25 text-white"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
