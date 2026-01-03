import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Services({ services, auth }) {
    const [selectedService, setSelectedService] = useState(null);
    const user = auth?.user;

    const handleSelectPackage = (pkg) => {
        if (!user) {
            window.location.href = route('login');
            return;
        }

        router.visit(route('orders.create', { package_id: pkg.id }));
    };

    return (
        <>
            <section id="services" className="py-24 relative z-10 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Main Container */}
                    <div className="border-2 border-slate-900 rounded-[3rem] bg-[#FAFAFA] p-8 md:p-16 relative overflow-hidden">

                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 relative z-10">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Our Services</h2>
                                <p className="text-slate-600 max-w-md text-lg">
                                    Choose the best service that fits your project needs. High quality work, guaranteed.
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <svg width="100" height="40" viewBox="0 0 100 40" className="text-slate-900">
                                    <path d="M0 20 Q 25 40 50 20 T 100 20" fill="none" stroke="currentColor" strokeWidth="4" />
                                </svg>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    className={`
                                        group relative rounded-3xl border-2 border-slate-900 p-8 flex flex-col h-full transition-all duration-300
                                        ${index === 1 ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 hover:bg-yellow-50'}
                                        hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]
                                    `}
                                >
                                    <div className="mb-6 flex justify-between items-start">
                                        <div className={`p-3 rounded-2xl border-2 border-current ${index === 1 ? 'bg-white/10' : 'bg-slate-100'}`}>
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-current transition-transform group-hover:rotate-45`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                                    <p className={`mb-8 flex-1 ${index === 1 ? 'text-slate-400' : 'text-slate-500'}`}>{service.description}</p>

                                    <div className="space-y-3 mb-8">
                                        {service.packages.slice(0, 3).map(pkg => (
                                            <div key={pkg.id} className={`flex justify-between items-center text-sm p-3 rounded-xl border-2 ${index === 1 ? 'border-white/20 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
                                                <span className="font-bold">{pkg.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setSelectedService(service)}
                                        className={`w-full py-4 rounded-xl font-bold border-2 border-slate-900 transition-all active:scale-95
                                            ${index === 1
                                                ? 'bg-white text-slate-900 hover:bg-yellow-400'
                                                : 'bg-slate-900 text-white hover:bg-slate-800'}
                                        `}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Detail Modal (Package Selection) - Updated to Light Theme */}
            {selectedService && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedService(null)}></div>
                    <div className="relative bg-white border-2 border-slate-900 rounded-[2rem] max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-8 border-b-2 border-slate-100 flex justify-between items-start bg-white z-20">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-2">{selectedService.name}</h3>
                                <p className="text-slate-500">Pilih paket yang sesuai dengan kebutuhan Anda</p>
                            </div>
                            <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-900 transition border-2 border-transparent hover:border-slate-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-8 custom-scrollbar bg-[#FAFAFA]">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedService.packages.map((pkg, idx) => (
                                    <div key={pkg.id} className="flex flex-col bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-slate-900 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 relative group">
                                        <div className="mb-6">
                                            <h4 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h4>
                                            <div className="flex flex-col gap-1 mb-2">
                                                <p className="text-3xl font-black text-slate-900">
                                                    {Number(pkg.price) > 0 ? `Rp ${new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(pkg.price)}` : 'Negotiable'}
                                                </p>
                                                {/* Duration & Note */}
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                        ⏱️ Est. {pkg.duration_days <= 3 ? '1-3 Hari' : pkg.duration_days <= 7 ? '6-7 Hari' : '10-15 Hari'}
                                                    </span>
                                                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                                        ⚡ Bisa selesai lebih cepat!
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 mb-8">
                                            <ul className="space-y-3">
                                                {(Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features || '[]')).map((feature, i) => (
                                                    <li key={i} className="flex items-start text-sm text-slate-600">
                                                        <svg className="w-5 h-5 text-green-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            onClick={() => handleSelectPackage(pkg)}
                                            className="block w-full text-center py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition border-2 border-transparent"
                                        >
                                            Pilih Paket Ini
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
