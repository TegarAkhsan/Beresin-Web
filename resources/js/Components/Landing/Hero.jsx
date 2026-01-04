import { Link } from '@inertiajs/react';

export default function Hero({ auth }) {

    const handleChatClick = () => {
        if (auth?.user) {
            window.dispatchEvent(new Event('open-chat'));
        } else {
            window.location.href = route('login');
        }
    };

    return (
        <header className="relative w-full min-h-screen flex flex-col justify-center px-6 pt-32 pb-20 overflow-hidden bg-[#FBFBFB]">
            {/* Soft Luxurious Grid Background */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            {/* Decorative Asterisk */}
            <div className="absolute top-32 left-10 lg:left-32 animate-spin-slow opacity-20 lg:opacity-100">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-900" strokeWidth="2">
                    <path d="M12 2v20M2 12h20M4.929 4.929l14.142 14.142M4.929 19.071L19.071 4.929" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto w-full text-center relative z-10">
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter mb-8 text-slate-900 leading-[0.9]">
                    Level Up Your <br />
                    <span className="inline-flex items-center gap-4 flex-wrap justify-center">
                        Project
                        <span className="hidden md:flex h-12 w-20 md:h-16 md:w-24 bg-black rounded-full items-center justify-center">
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </span>
                        With Our
                    </span> <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        Expert
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                    Platform jasa coding, desain, dan mobile app terpercaya. <br className="hidden md:block" />
                    Gabung dengan 2K+ Member dan selesaikan tugasmu sekarang.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-start pl-2">
                        <div className="flex text-yellow-500 text-sm">
                            {'★'.repeat(5)}
                        </div>
                        <span className="text-xs font-bold text-slate-500 tracking-wide">2K+ MEMBERS TRUST US</span>
                    </div>

                    <div className="w-px h-12 bg-slate-300 mx-6 hidden sm:block"></div>

                    <a
                        href="#services"
                        className="px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg transition flex items-center gap-2 group shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        Join Us
                        <span className="bg-white text-black rounded-full p-1 group-hover:rotate-45 transition duration-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                    </a>
                </div>

                {/* New Feature Cards Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">

                    {/* Card 1: Cepat & Berkualitas (Dark Theme) */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-left relative overflow-hidden group hover:-translate-y-2 transition duration-500 min-h-[320px] flex flex-col justify-between shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition"></div>

                        <div className="relative z-10">
                            <div className="w-fit px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold mb-6 tracking-wide">
                                PRIORITAS UTAMA
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-4 leading-tight">
                                Cepat & <br /> Berkualitas
                            </h3>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Deadline mepet? Tenang, kami kerjakan sat-set dengan standar tinggi.
                            </p>
                        </div>

                        <div className="relative z-10 mt-8">
                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Harga Pelajar (White Theme) */}
                    <div className="bg-white rounded-[2.5rem] p-10 text-left relative overflow-hidden group hover:-translate-y-2 transition duration-500  min-h-[320px] flex flex-col justify-between border-2 border-slate-100 shadow-xl hover:shadow-2xl hover:border-slate-200">
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-slate-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>

                        <div className="relative z-10">
                            <div className="w-fit px-4 py-2 rounded-full border-2 border-slate-900 text-slate-900 text-xs font-bold mb-6 tracking-wide">
                                BUDGET FRIENDLY
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                Harga <br /> Pelajar
                            </h3>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                Budget terbatas? Diskusikan harga yang pas untuk kantong mahasiswa.
                            </p>
                        </div>

                        <div className="relative z-10 mt-8">
                            <div className="flex items-center gap-2">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">100%</span>
                                <span className="text-sm font-bold text-slate-500 leading-tight">Negoz<br />able</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Gratis Konsultasi (Lime/Accent Theme) */}
                    <div className="bg-[#bef264] rounded-[2.5rem] p-10 text-left relative overflow-hidden group hover:-translate-y-2 transition duration-500 min-h-[320px] flex flex-col justify-between shadow-xl ring-4 ring-white">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <div className="w-fit px-4 py-2 rounded-full bg-black/10 text-slate-900 text-xs font-bold mb-6 tracking-wide">
                                FREE ACCESS
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                Gratis <br /> Konsultasi
                            </h3>
                            <p className="text-slate-800 text-lg leading-relaxed font-medium">
                                Bingung mulai dari mana? Chat admin sekarang, gratis tanpa dipungut biaya!
                            </p>
                        </div>

                        <div className="relative z-10 mt-8 w-full group-hover:translate-x-2 transition">
                            <button
                                onClick={handleChatClick}
                                className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-sm shadow-lg cursor-pointer hover:bg-black transition gap-2 w-full md:w-auto"
                            >
                                Chat Sekarang
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}
