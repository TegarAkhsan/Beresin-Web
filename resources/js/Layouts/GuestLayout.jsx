import { Link } from '@inertiajs/react';
import Asterisk from '@/Components/Landing/Asterisk';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBFBFB] pt-6 sm:justify-center sm:pt-0 relative overflow-hidden font-sans selection:bg-yellow-400 selection:text-black">
            {/* Grid Background */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            {/* Decorative Asterisks */}
            <Asterisk className="absolute top-10 left-10 w-16 h-16 text-slate-900/10 animate-spin-slow" />
            <Asterisk className="absolute bottom-10 right-10 w-24 h-24 text-yellow-400/50 animate-spin-reverse-slow" />

            <div className="relative z-10 mb-8">
                <Link href="/" className="flex flex-col items-center group">
                    <div className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                        <ApplicationLogo className="w-12 h-12" />
                        Beresin.
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-bold tracking-widest uppercase bg-white px-2 py-1 border border-slate-900 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Solusi Jasa Digital
                    </p>
                </Link>
            </div>

            <div className="relative z-10 w-full overflow-hidden bg-white px-8 py-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] sm:max-w-md sm:rounded-[2rem] border-2 border-slate-900 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                {children}
            </div>

            <p className="relative z-10 mt-12 text-xs text-slate-400 text-center font-medium">
                © {new Date().getFullYear()} Beresin. All rights reserved.
            </p>
        </div>
    );
}
