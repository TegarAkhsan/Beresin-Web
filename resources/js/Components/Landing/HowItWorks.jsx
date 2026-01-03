export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "Daftar / Login",
            description: "Buat akun baru atau masuk untuk memulai pesanan.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            )
        },
        {
            id: 2,
            title: "Pilih Layanan",
            description: "Pilih kategori layanan dan paket yang sesuai kebutuhan.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )
        },
        {
            id: 3,
            title: "Isi Detail Order",
            description: "Lengkapi form pemesanan dengan detail project Anda.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            id: 4,
            title: "Lakukan Pembayaran",
            description: "Transfer pembayaran dan upload bukti transfer.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            id: 5,
            title: "Konfirmasi WA",
            description: "Konfirmasi pesanan Anda ke admin via WhatsApp.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            )
        },
        {
            id: 6,
            title: "Pekerjaan Diproses",
            description: "Duduk manis, joki profesional kami akan mengerjakannya.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        }
    ];

    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden bg-white border-y-2 border-slate-900">
            {/* Geometric Pattern Background */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-black mb-4 text-slate-900 border-b-8 border-yellow-400 inline-block px-4">Cara Kerja Beresin</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mt-6 text-lg">Proses pemesanan yang simpel, transparan, dan terstruktur demi kenyamanan Anda.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step) => (
                        <div key={step.id} className="relative p-8 bg-[#F3F3F1] rounded-[2rem] border-2 border-slate-900 hover:bg-yellow-50 transition duration-300 group">
                            <div className="absolute -top-6 -left-6 w-14 h-14 bg-slate-900 rounded-2xl border-2 border-white flex items-center justify-center font-bold text-2xl text-white shadow-lg z-20 transform -rotate-6 group-hover:rotate-0 transition duration-300">
                                {step.id}
                            </div>
                            <div className="w-16 h-16 bg-white rounded-2xl border-2 border-slate-900 flex items-center justify-center mb-6 text-slate-900 group-hover:scale-110 transition duration-300">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
