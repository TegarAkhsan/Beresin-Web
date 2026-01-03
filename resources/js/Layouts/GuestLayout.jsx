import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-gray-50 to-indigo-50 pt-6 sm:justify-center sm:pt-0 relative overflow-hidden">
            {/* Subtle Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 opacity-20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 opacity-20 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
                <Link href="/" className="block text-center group">
                    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300">
                        Beresin.
                    </div>
                    <p className="text-xs text-gray-400 mt-1 tracking-wider uppercase">Solusi Jasa Digital Anda</p>
                </Link>
            </div>

            <div className="relative z-10 mt-8 w-full overflow-hidden bg-white/80 backdrop-blur-sm px-8 py-8 shadow-xl sm:max-w-md sm:rounded-2xl border border-white/50">
                {children}
            </div>

            <p className="relative z-10 mt-8 text-xs text-gray-400 text-center">
                © 2026 Beresin. All rights reserved.
            </p>
        </div>
    );
}
