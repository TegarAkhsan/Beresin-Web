import { useState } from 'react';

const faqData = [
    {
        question: "Apakah Beresin aman?",
        answer: "Ya, sistem kami menjamin keamanan data. Semua pekerjaan dikelola oleh admin secara terkontrol, dan pembayaran ditahan (escrow) hingga pekerjaan selesai."
    },
    {
        question: "Berapa lama pengerjaan?",
        answer: "Durasi pengerjaan sesuai deadline yang disepakati di awal saat pemesanan. Kami sangat menghargai waktu Anda."
    },
    {
        question: "Apakah bisa revisi?",
        answer: "Tentu bisa! Jumlah revisi sesuai dengan ketentuan pada paket layanan yang Anda pilih (Dasar, Menengah, atau Atas)."
    },
    {
        question: "Bagaimana cara konfirmasi?",
        answer: "Setelah melakukan pembayaran dan upload bukti, Anda akan diarahkan otomatis untuk konfirmasi ke WhatsApp admin kami untuk verifikasi cepat."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-white relative z-10">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-black mb-4 text-slate-900">Frequently Asked Questions</h2>
                    <p className="text-slate-600">Pertanyaan umum seputar layanan Beresin</p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#FAFAFA] rounded-2xl border-2 border-slate-900 overflow-hidden transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                            >
                                <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {item.question}
                                </span>
                                <svg
                                    className={`w-6 h-6 text-slate-900 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                className={`px-6 text-slate-600 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                {item.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
