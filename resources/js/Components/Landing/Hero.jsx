import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-bg.png"
                    alt="Future Tech Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/50 to-slate-900"></div>
            </div>

            {/* Animated Blobs (Overlay) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-40">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mt-16">
                <h1 className="text-5xl lg:text-8xl font-extrabold tracking-tight mb-8 text-white drop-shadow-2xl">
                    Tuntaskan Tugas Digitalmu <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        Tanpa Ribet
                    </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-200 max-w-3xl mx-auto mb-12 leading-relaxed font-light drop-shadow-md">
                    Platform jasa coding, desain, dan mobile app terpercaya.
                    <br className="hidden md:block" />
                    Serahkan pada joki profesional, fokus pada hal yang lebih penting.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <a
                        href="#services"
                        className="px-10 py-5 rounded-full bg-indigo-600 hover:bg-indigo-500 font-bold text-lg text-white transition shadow-xl shadow-indigo-600/30 transform hover:-translate-y-1"
                    >
                        Lihat Layanan
                    </a>
                    <Link
                        href={route('register')}
                        className="px-10 py-5 rounded-full bg-white/10 hover:bg-white/20 font-bold text-lg text-white transition backdrop-blur-md border border-white/20 transform hover:-translate-y-1"
                    >
                        Buat Akun
                    </Link>
                </div>
            </div>
        </header>
    );
}
