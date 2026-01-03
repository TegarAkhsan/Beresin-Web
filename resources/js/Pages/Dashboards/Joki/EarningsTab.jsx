export default function EarningsTab({ stats }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in-up">
            <h3 className="font-bold text-2xl mb-8 text-gray-800">Financial Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider mb-2">Available for Withdrawal</p>
                        <p className="text-4xl font-black text-emerald-800">Rp {new Intl.NumberFormat('id-ID').format(stats.total_earnings)}</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                        <svg className="w-32 h-32 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                    </div>
                </div>
                <div className="p-8 bg-amber-50 rounded-2xl border border-amber-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm text-amber-600 font-bold uppercase tracking-wider mb-2">Pending Clearance</p>
                        <p className="text-4xl font-black text-amber-800">Rp {new Intl.NumberFormat('id-ID').format(stats.held_earnings)}</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                        <svg className="w-32 h-32 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 001-1l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
