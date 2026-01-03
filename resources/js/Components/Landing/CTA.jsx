import { Link } from '@inertiajs/react';

export default function CTA() {
    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full transform scale-75"></div>

            <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white tracking-tight">
                    Siap Menyelesaikan Tugas Digital Anda?
                </h2>
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                    Jangan biarkan deadline menghantui. Serahkan pada ahlinya dan dapatkan hasil terbaik sekarang juga.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={route('register')}
                        className="px-8 py-4 rounded-full bg-white text-indigo-900 hover:bg-slate-100 font-bold text-lg transition shadow-xl"
                    >
                        Mulai Sekarang
                    </Link>
                    <a
                        href="#how-it-works"
                        className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition shadow-xl shadow-indigo-600/30 border border-indigo-500"
                    >
                        Pelajari Cara Kerja
                    </a>
                </div>
            </div>
        </section>
    );
}
