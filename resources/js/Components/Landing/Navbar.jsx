import { Link } from '@inertiajs/react';

export default function Navbar({ auth, canLogin, canRegister }) {
    return (
        <nav className="fixed w-full z-50 bg-[#F3F3F1]/80 backdrop-blur-md border-b-2 border-slate-900/50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="text-2xl font-black italic tracking-tighter text-slate-900 flex items-center gap-1">
                    <span className="bg-yellow-400 w-4 h-4 rounded-full border-2 border-slate-900 block"></span>
                    Beresin.
                </div>
                <div className="flex items-center gap-6">
                    {canLogin && (
                        <>
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2 rounded-full font-bold border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="px-6 py-2 rounded-full font-bold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                                    >
                                        Log Out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="font-bold text-slate-600 hover:text-slate-900 transition"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2 rounded-full bg-slate-900 border-2 border-slate-900 text-white font-bold hover:bg-white hover:text-slate-900 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
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
