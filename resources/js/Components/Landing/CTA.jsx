import { Link } from '@inertiajs/react';

export default function CTA() {
    return (
        <section className="py-24 bg-yellow-400 relative overflow-hidden border-y-2 border-slate-900">
            {/* Geometric Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl lg:text-6xl font-black mb-6 text-slate-900 tracking-tight leading-tight">
                    Siap Menyelesaikan <br /> Tugas Digital Anda?
                </h2>
                <p className="text-xl text-slate-900/80 mb-10 max-w-2xl mx-auto font-medium">
                    Jangan biarkan deadline menghantui. Serahkan pada ahlinya dan dapatkan hasil terbaik sekarang juga.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={route('register')}
                        className="px-8 py-4 rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold text-lg transition shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                        Mulai Sekarang
                    </Link>
                    <a
                        href="#how-it-works"
                        className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg transition border-2 border-slate-900 hover:bg-slate-50"
                    >
                        Pelajari Cara Kerja
                    </a>
                </div>
            </div>
        </section>
    );
}
