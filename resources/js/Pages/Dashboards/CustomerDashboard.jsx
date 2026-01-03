import { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Asterisk from '@/Components/Landing/Asterisk';

export default function CustomerDashboard({ auth, orders, stats }) {
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('overview');

    // Profile Form
    const { data: profileData, setData: setProfileData, patch: patchProfile, processing: profileProcessing, errors: profileErrors, recentlySuccessful: profileSuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        university: user.university || '',
        address: user.address || '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        patchProfile(route('profile.update'));
    };

    // Calculate Profile Completeness
    const profileFields = ['name', 'email', 'phone', 'university', 'address'];
    const filledFields = profileFields.filter(field => user[field]).length;
    const progressPercentage = Math.round((filledFields / profileFields.length) * 100);

    const SidebarItem = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold border-2 ${activeTab === id
                ? 'bg-yellow-400 text-slate-900 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -translate-y-1 -translate-x-1'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen flex font-sans selection:bg-yellow-400 selection:text-black bg-[#F3F3F1]">

            {/* Sidebar */}
            <aside className="w-72 border-r-2 border-slate-900 fixed h-full z-20 flex flex-col p-6 bg-white">
                <div className="flex items-center space-x-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <span className="font-black text-xl text-slate-900">B.</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-slate-900">Beresin.</span>
                </div>

                <nav className="space-y-4 flex-1">
                    <SidebarItem id="overview" label="Overview" icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    } />
                    <SidebarItem id="orders" label="Order Saya" icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    } />
                    <SidebarItem id="profile" label="Profil Saya" icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    } />
                </nav>

                <div className="mt-auto pt-6 border-t-2 border-slate-900">
                    <Link href={route('logout')} method="post" as="button" className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-slate-900 bg-white hover:bg-red-50 text-slate-900 font-bold transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Keluar</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 overflow-y-auto relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-10">
                    <Asterisk className="w-64 h-64 text-slate-900" />
                </div>

                <header className="flex justify-between items-center mb-12 relative z-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                            {activeTab === 'overview' && 'Ringkasan'}
                            {activeTab === 'orders' && 'Order Saya'}
                            {activeTab === 'profile' && 'Profil Saya'}
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">
                            Selamat datang, <span className="text-slate-900 font-bold underline decoration-yellow-400 underline-offset-4">{user.name}</span>!
                        </p>
                    </div>
                </header>

                {/* OVERVIEW CONTENT */}
                {activeTab === 'overview' && (
                    <div className="space-y-10 animate-fade-in-up relative z-10">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Order', value: stats.total_orders, bg: 'bg-white', iconColor: 'text-blue-600' },
                                { label: 'Order Aktif', value: stats.active_orders, bg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
                                { label: 'Selesai', value: stats.completed_orders, bg: 'bg-green-50', iconColor: 'text-green-600' },
                                { label: 'Menunggu Bayar', value: stats.pending_payment_orders, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white rounded-[2rem] p-6 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                                            <h3 className="text-4xl font-black mt-2 text-slate-900">{stat.value}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-[8px_8px_0px_0px_#fbbf24] border-2 border-slate-900">
                                <Asterisk className="absolute -top-10 -right-10 w-48 h-48 text-white/10 animate-spin-slow" />
                                <h3 className="text-3xl font-black mb-4 relative z-10">Mulai Project Baru?</h3>
                                <p className="text-slate-300 mb-8 relative z-10 max-w-sm text-lg">Temukan layanan terbaik kami untuk membantu tugasmu selesai lebih cepat.</p>
                                <Link href="/#services" className="inline-flex items-center px-8 py-4 bg-yellow-400 text-slate-900 font-black rounded-xl border-2 border-slate-900 hover:bg-yellow-300 transition shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] relative z-10">
                                    + Buat Order Baru
                                </Link>
                            </div>

                            <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                                <h3 className="text-2xl font-black mb-6 text-slate-900">Status Profil</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-slate-500">Kelengkapan Data</span>
                                        <span className="font-black text-2xl text-slate-900">{progressPercentage}%</span>
                                    </div>
                                    <div className="w-full rounded-full h-6 bg-slate-100 border-2 border-slate-900 overflow-hidden">
                                        <div className="h-full bg-yellow-400 border-r-2 border-slate-900 transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        {progressPercentage === 100
                                            ? "Hebat! Profil Anda sudah lengkap. Anda siap untuk melakukan pemesanan."
                                            : "Lengkapi profil Anda untuk memudahkan administrasi dan verifikasi order layanan kami."}
                                    </p>
                                    <button onClick={() => setActiveTab('profile')} className="text-slate-900 font-bold underline decoration-2 decoration-yellow-400 hover:bg-yellow-400 hover:text-slate-900 transition-colors px-2 py-1 rounded inline-block">
                                        Lengkapi Profil &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDERS CONTENT */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-[2rem] border-2 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-fade-in-up">
                        {orders.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-900 flex items-center justify-center mx-auto mb-6">
                                    <Asterisk className="w-12 h-12 text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-black mb-2 text-slate-900">Belum ada pesanan</h3>
                                <p className="mb-8 text-slate-500 font-medium">Anda belum pernah melakukan pemesanan layanan apapun.</p>
                                <Link href="/#services" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                    Buat Order Sekarang
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="uppercase text-sm font-black bg-yellow-400 text-slate-900 border-b-2 border-slate-900">
                                        <tr>
                                            <th className="px-8 py-5">ID Order</th>
                                            <th className="px-8 py-5">Layanan</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5">Tagihan</th>
                                            <th className="px-8 py-5">Invoice</th>
                                            <th className="px-8 py-5">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-slate-100">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-8 py-5 font-mono font-bold text-slate-900">#{order.order_number}</td>
                                                <td className="px-8 py-5">
                                                    <div className="font-bold text-slate-900">{order.package?.service?.name}</div>
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{order.package?.name}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 text-xs font-black rounded-lg border-2 
                                                        ${order.status === 'completed' ? 'bg-green-100 text-green-700 border-green-700' :
                                                            order.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-700' :
                                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-700' :
                                                                    'bg-yellow-100 text-yellow-700 border-yellow-700'}`}>
                                                        {order.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 font-bold text-slate-900">
                                                    Rp {new Intl.NumberFormat('id-ID').format(order.amount)}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <a href={route('orders.invoice', order.id)} target="_blank" className="inline-flex items-center px-3 py-1 border-2 border-slate-900 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white transition">
                                                        PDF
                                                    </a>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center space-x-3">
                                                        <Link href={route('orders.show', order.id)} className="font-bold text-slate-900 underline hover:text-blue-600">
                                                            Detail
                                                        </Link>
                                                        {order.status === 'pending_payment' && (
                                                            <Link
                                                                href={route('orders.cancel', order.id)}
                                                                method="post"
                                                                as="button"
                                                                className="font-bold text-red-600 hover:text-red-800"
                                                                preserveScroll
                                                            >
                                                                Cancel
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* PROFILE CONTENT */}
                {activeTab === 'profile' && (
                    <div className="max-w-3xl bg-white border-2 border-slate-900 rounded-[2rem] p-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-fade-in-up">
                        <h3 className="text-2xl font-black mb-8 text-slate-900 flex items-center gap-3">
                            <span className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-slate-900 block"></span>
                            Edit Profil
                        </h3>

                        {profileSuccessful && (
                            <div className="mb-8 p-4 bg-green-100 border-2 border-green-700 rounded-xl text-green-800 font-bold flex items-center shadow-[4px_4px_0px_0px_#15803d]">
                                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                Profil berhasil diperbarui!
                            </div>
                        )}

                        <form onSubmit={submitProfile} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-2 border-slate-900 px-4 py-3 focus:ring-0 focus:border-slate-900 focus:bg-yellow-50 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] font-medium"
                                        value={profileData.name}
                                        onChange={e => setProfileData('name', e.target.value)}
                                    />
                                    {profileErrors.name && <p className="text-red-600 font-bold text-xs mt-1 border-l-2 border-red-600 pl-2">{profileErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Email</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-xl border-2 border-slate-900 px-4 py-3 bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
                                        value={profileData.email}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">No. WhatsApp</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-2 border-slate-900 px-4 py-3 focus:ring-0 focus:border-slate-900 focus:bg-yellow-50 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] font-medium"
                                        placeholder="0812..."
                                        value={profileData.phone}
                                        onChange={e => setProfileData('phone', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Universitas / Sekolah</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-2 border-slate-900 px-4 py-3 focus:ring-0 focus:border-slate-900 focus:bg-yellow-50 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] font-medium"
                                        placeholder="Asal Instansi"
                                        value={profileData.university}
                                        onChange={e => setProfileData('university', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Alamat Lengkap</label>
                                <textarea
                                    className="w-full rounded-xl border-2 border-slate-900 px-4 py-3 focus:ring-0 focus:border-slate-900 focus:bg-yellow-50 transition h-32 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] font-medium"
                                    placeholder="Jalan..."
                                    value={profileData.address}
                                    onChange={e => setProfileData('address', e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end pt-6 border-t-2 border-slate-100">
                                <button
                                    type="submit"
                                    disabled={profileProcessing}
                                    className="px-8 py-4 bg-slate-900 text-white font-black rounded-xl border-2 border-slate-900 hover:bg-slate-800 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50"
                                >
                                    {profileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
