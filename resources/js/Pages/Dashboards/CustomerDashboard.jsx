import { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function CustomerDashboard({ auth, orders, stats }) {
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('overview');
    const [darkMode, setDarkMode] = useState(false);

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

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const SidebarItem = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === id
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm border border-blue-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                } ${darkMode ? 'dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white' : ''} ${activeTab === id && darkMode ? 'dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800' : ''}`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className={`min-h-screen flex font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}>

            {/* Sidebar */}
            <aside className={`w-64 border-r fixed h-full z-10 flex flex-col p-6 transition-colors duration-300 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center space-x-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>Beresin.</span>
                </div>

                <nav className="space-y-1 flex-1">
                    <SidebarItem id="overview" label="Overview" icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    } />
                    <SidebarItem id="orders" label="Order Saya" icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    } />
                    <SidebarItem id="profile" label="Profil Saya" icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    } />
                </nav>

                <div className={`mt-auto pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <button
                        onClick={toggleTheme}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        {darkMode ? (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                <span className="font-medium">Light Mode</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                <span className="font-medium">Dark Mode</span>
                            </>
                        )}
                    </button>
                    <Link href={route('logout')} method="post" as="button" className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Keluar</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            {activeTab === 'overview' && 'Ringkasan'}
                            {activeTab === 'orders' && 'Order Saya'}
                            {activeTab === 'profile' && 'Profil Saya'}
                        </h1>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Selamat datang kembali, <span className="text-blue-500 font-semibold">{user.name}</span>!
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`p-1 rounded-full border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* OVERVIEW CONTENT */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Order', value: stats.total_orders, color: 'text-blue-600', bg: 'bg-blue-50', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                                { label: 'Order Aktif', value: stats.active_orders, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { label: 'Selesai', value: stats.completed_orders, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { label: 'Menunggu Bayar', value: stats.pending_payment_orders, color: 'text-amber-600', bg: 'bg-amber-50', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                            ].map((stat, idx) => (
                                <div key={idx} className={`rounded-xl p-6 border transition-all duration-300 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                                            <h3 className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{stat.value}</h3>
                                        </div>
                                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : stat.bg}`}>
                                            <svg className={`w-6 h-6 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                <h3 className="text-2xl font-bold mb-2 relative z-10">Mulai Project Baru?</h3>
                                <p className="text-blue-100 mb-8 relative z-10 max-w-xs">Jelajahi layanan kami dan temukan solusi terbaik untuk kebutuhan Anda.</p>
                                <Link href="/#services" className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg relative z-10">
                                    + Buat Order Baru
                                </Link>
                            </div>

                            <div className={`rounded-2xl p-8 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Status Profil</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Kelengkapan Data</span>
                                        <span className={`font-semibold ${progressPercentage === 100 ? 'text-emerald-500' : 'text-amber-500'}`}>{progressPercentage}%</span>
                                    </div>
                                    <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                        <div className={`h-3 rounded-full transition-all duration-500 ${progressPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {progressPercentage === 100
                                            ? "Hebat! Profil Anda sudah lengkap. Anda siap untuk melakukan pemesanan."
                                            : "Lengkapi profil Anda untuk memudahkan administrasi dan verifikasi order layanan kami."}
                                    </p>
                                    <button onClick={() => setActiveTab('profile')} className="text-blue-500 text-sm font-semibold hover:text-blue-600 flex items-center mt-2">
                                        Lengkapi Profil <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDERS CONTENT */}
                {activeTab === 'orders' && (
                    <div className={`rounded-2xl border overflow-hidden animate-fade-in-up ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                        {orders.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                                    <svg className={`w-10 h-10 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Belum ada pesanan</h3>
                                <p className={`mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Anda belum pernah melakukan pemesanan layanan apapun.</p>
                                <Link href="/#services" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
                                    Buat Order Sekarang
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className={`uppercase text-xs font-semibold ${darkMode ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                        <tr>
                                            <th className="px-6 py-4">ID Order</th>
                                            <th className="px-6 py-4">Layanan</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Tagihan</th>
                                            <th className="px-6 py-4">Invoice</th>
                                            <th className="px-6 py-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${darkMode ? 'divide-slate-700 border-t border-slate-700' : 'divide-slate-100 border-t border-slate-100'}`}>
                                        {orders.map((order) => (
                                            <tr key={order.id} className={`transition ${darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                                                <td className={`px-6 py-4 font-mono font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>#{order.order_number}</td>
                                                <td className="px-6 py-4">
                                                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>{order.package?.service?.name}</div>
                                                    <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{order.package?.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full border 
                                                        ${order.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                            order.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                    'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                        {order.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-emerald-600">
                                                    Rp {new Intl.NumberFormat('id-ID').format(order.amount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a href={route('orders.invoice', order.id)} target="_blank" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                        PDF
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <Link href={route('orders.show', order.id)} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                                                            Detail &rarr;
                                                        </Link>
                                                        {order.status === 'pending_payment' && (
                                                            <Link
                                                                href={route('orders.cancel', order.id)}
                                                                method="post"
                                                                as="button"
                                                                className="text-sm font-medium text-red-500 hover:text-red-700 transition"
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
                    <div className={`max-w-2xl border rounded-2xl p-8 animate-fade-in-up ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Edit Profil</h3>

                        {profileSuccessful && (
                            <div className="mb-6 p-4 bg-green-50 last:border border-green-100 rounded-xl text-green-600 text-sm font-medium flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Profil berhasil diperbarui.
                            </div>
                        )}

                        <form onSubmit={submitProfile} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Nama Lengkap</label>
                                    <input
                                        type="text"
                                        className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 border'}`}
                                        value={profileData.name}
                                        onChange={e => setProfileData('name', e.target.value)}
                                    />
                                    {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Email</label>
                                    <input
                                        type="email"
                                        className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 border'}`}
                                        value={profileData.email}
                                        onChange={e => setProfileData('email', e.target.value)}
                                    />
                                    {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>No. WhatsApp</label>
                                    <input
                                        type="text"
                                        className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 border'}`}
                                        placeholder="0812..."
                                        value={profileData.phone}
                                        onChange={e => setProfileData('phone', e.target.value)}
                                    />
                                    {profileErrors.phone && <p className="text-red-500 text-xs mt-1">{profileErrors.phone}</p>}
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Universitas / Sekolah</label>
                                    <input
                                        type="text"
                                        className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 border'}`}
                                        placeholder="Asal Instansi"
                                        value={profileData.university}
                                        onChange={e => setProfileData('university', e.target.value)}
                                    />
                                    {profileErrors.university && <p className="text-red-500 text-xs mt-1">{profileErrors.university}</p>}
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Alamat Lengkap</label>
                                <textarea
                                    className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition h-24 ${darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 border'}`}
                                    placeholder="Jalan..."
                                    value={profileData.address}
                                    onChange={e => setProfileData('address', e.target.value)}
                                ></textarea>
                                {profileErrors.address && <p className="text-red-500 text-xs mt-1">{profileErrors.address}</p>}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={profileProcessing}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
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
                    animation: fadeInUp 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
