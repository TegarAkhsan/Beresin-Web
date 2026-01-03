export default function Features() {
    const features = [
        {
            title: "Admin Terkontrol",
            desc: "Setiap order diawasi langsung oleh admin untuk menjamin kualitas.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
        {
            title: "Harga Transparan",
            desc: "Tidak ada biaya tersembunyi. Apa yang Anda lihat adalah yang Anda bayar.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Progress Terpantau",
            desc: "Update rutin dan tracking status pengerjaan secara real-time.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            title: "Aman & Rahasia",
            desc: "Data privasi project Anda aman bersama kami. 100% Confidential.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-yellow-600 font-bold uppercase tracking-wider text-sm mb-2 block">Why Choose Us</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">Keunggulan<br />Beresin.</h2>
                    </div>
                    <p className="text-slate-600 max-w-lg text-lg">
                        Kami tidak hanya sekedar mengerjakan tugas, tapi memberikan solusi terbaik dengan standar profesional.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((item, index) => (
                        <div key={index}
                            className="bg-white p-8 rounded-3xl border-2 border-slate-900 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-start group"
                        >
                            <div className="w-14 h-14 bg-yellow-400 rounded-2xl border-2 border-slate-900 flex items-center justify-center mb-6 text-slate-900 group-hover:rotate-12 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
