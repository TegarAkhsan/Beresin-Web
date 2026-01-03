export default function EarningsTab({ stats }) {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <header>
                <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Track your earnings and pending payouts.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Available Earnings */}
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <p className="text-sm text-emerald-700 font-bold uppercase tracking-wider">Available for Withdrawal</p>
                        </div>
                        <p className="text-4xl font-bold text-emerald-900 tracking-tight">
                            <span className="text-xl align-top mr-1 font-semibold text-emerald-600">Rp</span>
                            {new Intl.NumberFormat('id-ID').format(stats.total_earnings)}
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                        <svg className="w-40 h-40 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                    </div>
                </div>

                {/* Pending Earnings */}
                <div className="p-8 bg-amber-50 rounded-2xl border border-amber-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <p className="text-sm text-amber-700 font-bold uppercase tracking-wider">Pending Clearance</p>
                        </div>
                        <p className="text-4xl font-bold text-amber-900 tracking-tight">
                            <span className="text-xl align-top mr-1 font-semibold text-amber-600">Rp</span>
                            {new Intl.NumberFormat('id-ID').format(stats.held_earnings)}
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                        <svg className="w-40 h-40 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 001-1l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
