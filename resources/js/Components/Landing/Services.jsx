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
            <section id="services" className="py-24 bg-slate-800/50 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Layanan Unggulan Kami</h2>
                        <p className="text-slate-400">Pilih kategori layanan sesuai kebutuhan project Anda</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.id} className="group relative bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition rounded-2xl"></div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">{service.name}</h3>
                                    <p className="text-slate-400 mb-6">{service.description}</p>

                                    <div className="space-y-3 mb-8 flex-1">
                                        {service.packages.map(pkg => (
                                            <div key={pkg.id} className={`flex justify-between items-center text-sm p-3 rounded-lg border ${pkg.price == 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5'}`}>
                                                <span className={`${pkg.price == 0 ? 'text-emerald-300 font-medium' : 'text-slate-300'}`}>{pkg.name}</span>
                                                <span className="font-semibold text-emerald-400">
                                                    {Number(pkg.price) > 0
                                                        ? `Rp ${new Intl.NumberFormat('id-ID').format(pkg.price)}`
                                                        : 'Negotiable'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setSelectedService(service)}
                                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold text-white shadow-lg shadow-indigo-500/20"
                                    >
                                        Pilih Layanan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Detail Modal (Package Selection) */}
            {selectedService && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedService(null)}></div>
                    <div className="relative bg-slate-900 border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-start bg-slate-900 z-20">
                            <div>
                                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">{selectedService.name}</h3>
                                <p className="text-slate-400">Pilih paket yang sesuai dengan kebutuhan Anda</p>
                            </div>
                            <button onClick={() => setSelectedService(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedService.packages.map(pkg => (
                                    <div key={pkg.id} className="flex flex-col bg-slate-800/50 rounded-2xl border border-white/10 p-6 hover:border-indigo-500/50 transition duration-300 relative group">
                                        <div className="mb-6">
                                            <h4 className="text-xl font-bold text-white mb-2">{pkg.name}</h4>
                                            <p className="text-3xl font-bold text-emerald-400">
                                                {Number(pkg.price) > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(pkg.price)}` : 'Negotiable'}
                                            </p>
                                        </div>
                                        <div className="flex-1 mb-8">
                                            <ul className="space-y-3">
                                                {(Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features || '[]')).map((feature, idx) => (
                                                    <li key={idx} className="flex items-start text-sm text-slate-300">
                                                        <svg className="w-5 h-5 text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            onClick={() => handleSelectPackage(pkg)}
                                            className="block w-full text-center py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-500/20"
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
