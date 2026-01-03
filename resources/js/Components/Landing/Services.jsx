import { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function Services({ services, auth, whatsappNumber }) {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);

    const user = auth?.user;

    const { data, setData, post, processing, errors, reset } = useForm({
        package_id: '',
        name: user?.name || '',
        gender: user?.gender || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        university: user?.university || '',
        referral_source: user?.referral_source || '',
        description: '', // Optional description
    });

    useEffect(() => {
        if (user) {
            setData({
                ...data,
                name: user.name,
                gender: user.gender || '',
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                university: user.university || '',
                referral_source: user.referral_source || '',
            });
        }
    }, [user]);

    const handleSelectPackage = (pkg) => {
        if (!user) {
            window.location.href = route('login');
            return;
        }
        setSelectedPackage(pkg);
        setData('package_id', pkg.id);
        setShowOrderForm(true);
    };

    const submitOrder = (e) => {
        e.preventDefault();
        post(route('orders.store'), {
            onSuccess: (page) => {
                setShowOrderForm(false);
                setShowSuccessModal(true);
                reset();
                // Check if we have the order from the flash message/props
                if (page.props.flash.order) {
                    setCreatedOrder(page.props.flash.order);
                }
            },
            preserveScroll: true,
        });
    };

    const getWhatsAppLink = () => {
        if (!whatsappNumber) return '#';

        const phone = whatsappNumber;
        let text = '';

        if (createdOrder) {
            text = `Halo Admin Beresin, saya ingin konfirmasi pesanan baru.
             
ID Order: *${createdOrder.order_number}*
Nama: ${data.name}
Layanan: ${selectedService?.name} - ${selectedPackage?.name}
Total: Rp ${new Intl.NumberFormat('id-ID').format(selectedPackage?.price || 0)}

Mohon diproses. Terima kasih.`;
        } else {
            text = `Halo Admin Beresin, saya telah melakukan pemesanan baru via Website.
        
Nama: ${data.name}
Layanan: ${selectedService?.name} - ${selectedPackage?.name}

Mohon konfirmasinya. Terima kasih.`;
        }

        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
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
            {selectedService && !showOrderForm && (
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

            {/* Order Form Modal */}
            {showOrderForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowOrderForm(false)}></div>
                    <div className="relative bg-slate-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900 z-20">
                            <h3 className="text-xl font-bold text-white">Lengkapi Data Pemesanan</h3>
                            <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="overflow-y-auto p-6 custom-scrollbar">
                            <form onSubmit={submitOrder} className="space-y-6">
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6">
                                    <div className="text-sm text-indigo-300">Anda memesan:</div>
                                    <div className="font-bold text-white text-lg">{selectedService?.name} - {selectedPackage?.name}</div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Nama Lengkap</label>
                                        <input type="text" className="w-full bg-slate-800 border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Jenis Kelamin</label>
                                        <select className="w-full bg-slate-800 border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white" value={data.gender} onChange={e => setData('gender', e.target.value)} required>
                                            <option value="">Pilih...</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Email</label>
                                        <input type="email" className="w-full bg-slate-800 border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">No. WhatsApp / Telp</label>
                                        <input type="text" className="w-full bg-slate-800 border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white" value={data.phone} onChange={e => setData('phone', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Asal Universitas / Sekolah</label>
                                        <input type="text" className="w-full bg-slate-800 border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white" value={data.university} onChange={e => setData('university', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Tahu Kami Dari Mana?</label>
                                        <select className="w-full bg-slate-800 border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white" value={data.referral_source} onChange={e => setData('referral_source', e.target.value)} required>
                                            <option value="">Pilih...</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="TikTok">TikTok</option>
                                            <option value="Teman">Teman</option>
                                            <option value="Lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Alamat Lengkap</label>
                                    <textarea className="w-full bg-slate-800 border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white h-24" value={data.address} onChange={e => setData('address', e.target.value)} required></textarea>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" disabled={processing} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition disabled:opacity-50">
                                        {processing ? 'Memproses...' : 'Buat Pesanan Sekarang'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md"></div>
                    <div className="relative bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl animate-fade-in-up">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Pemesanan Berhasil!</h3>
                        <p className="text-slate-400 mb-8">Terima kasih telah mempercayakan project Anda kepada kami. Silakan konfirmasi pesanan Anda melalui WhatsApp untuk diproses lebih lanjut.</p>

                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition mb-4 flex items-center justify-center"
                        >
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.029.613 1.947.971 3.22.971 3.181 0 5.767-2.586 5.768-5.766s-2.587-5.766-5.768-5.766zm-4.306 1.761c.42 0 .61.01.768.01.171 0 .422.02.631.52.22.5.733 1.77.795 1.901.062.14.072.29.01.421-.06.13-.1.22-.199.33-.109.111-.229.251-.329.351-.111.11-.222.23-.09.46.131.23.57 1.05 1.258 1.631.884.75 1.63 1.01 1.861 1.121.231.12.37.1.511-.05.14-.15.6-.69.759-.93.159-.24.319-.201.539-.12.219.08 1.399.66 1.639.78.239.12.399.18.459.28.06.1.06.58-.15 1.09-.2.5-1.168.97-1.598 1.01-.43.05-.83.21-3.218-.72-1.848-.73-3.028-2.61-3.119-2.73-.09-.12-1.298-1.73-1.298-3.3s.68-2.33 1.229-2.88c.2-.21.46-.3.69-.3z" /></svg>
                            Konfirmasi via WhatsApp
                        </a>

                        <button onClick={() => { setShowSuccessModal(false); window.location.href = '/dashboard'; }} className="text-slate-500 hover:text-white text-sm font-medium">
                            Kembali ke Dashboard
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
