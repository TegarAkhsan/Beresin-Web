export default function Testimonials() {
    const testimonials = [
        {
            name: "Sarah Wijaya",
            role: "Mahasiswa Informatika",
            text: "Gila sih, Beresin nylamatin semester gue! Joki tugas coding di sini rapi banget kodenya, plus dijelasin juga logic-nya. Worth it parah.",
            rating: 5,
        },
        {
            name: "Budi Santoso",
            role: "Entrepreneur",
            text: "Butuh desain UI buat startup baruku, hasilnya clean dan modern banget sesuai request. Revisi juga cepet. Mantap!",
            rating: 5,
        },
        {
            name: "Citra Lestari",
            role: "Mahasiswa DKV",
            text: "Kualitas desainnya gak main-main. Tugas poster gue dapet nilai A dong. Fix bakal langganan terus kalo deadliner.",
            rating: 5,
        },
        {
            name: "Dimas Anggara",
            role: "Mobile Dev Student",
            text: "Awalnya ragu, tapi ternyata joki mobile app-nya pro banget. Bug free dan UI-nya smooth. Adminnya juga fast response.",
            rating: 4,
        },
        {
            name: "Eka Putri",
            role: "Mahasiswa Sistem Informasi",
            text: "Bantu banget buat ngerjain tugas Laravel yang error terus. Debugging-nya cepet, dijelasin pula kenapa errornya. Top!",
            rating: 5,
        },
        {
            name: "Fajar Nugraha",
            role: "Junior Web Dev",
            text: "Order slicing UI ke React, hasilnya pixel perfect sama desain di Figma. Code structure-nya juga rapi, gampang dimaintain.",
            rating: 5,
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-[#F8F9FC] to-white -z-10"></div>
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl -z-10 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Kata Mereka <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Tentang Beresin</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Jangan cuma percaya kata kami. Lihat apa kata mahasiswa dan profesional yang sudah terbantu oleh layanan kami.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/60 backdrop-blur-md border border-white/50 p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-slate-700 italic mb-6 leading-relaxed">"{item.text}"</p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
