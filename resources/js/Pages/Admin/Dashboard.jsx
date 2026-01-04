import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, joki_workload }) {
    return (
        <AdminLayout
            user={auth.user}
            header="Overview"
        >
            <Head title="Admin Dashboard" />

            {/* Stats Grid - Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Orders" value={stats.total_orders} subtitle="Lifetime" color="blue" />
                <StatCard title="Active Orders" value={stats.active_orders} subtitle="In Progress / Review" color="amber" />
                <StatCard title="Revenue" value={`Rp ${new Intl.NumberFormat('id-ID').format(stats.revenue)}`} subtitle="Paid Orders" color="emerald" />
                <StatCard title="Total Jokis" value={stats.total_jokis} subtitle="Active Staff" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                {/* Joki Workload - Using more space */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Joki Workload</h3>
                        <span className="px-3 py-1 bg-gray-50 text-xs font-semibold text-gray-500 rounded-full">Top 5 Active</span>
                    </div>
                    <div className="p-2 flex-1">
                        {joki_workload.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {joki_workload.map((joki) => (
                                    <div key={joki.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-xl transition">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                                {joki.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{joki.name}</div>
                                                <div className="text-xs text-gray-500">{joki.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold text-gray-900">{joki.active_jobs_count} Tasks</span>
                                            <span className="text-xs text-gray-400">In Progress</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">No active jokis found.</div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, subtitle, color }) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        amber: 'text-amber-600 bg-amber-50',
        emerald: 'text-emerald-600 bg-emerald-50',
        purple: 'text-purple-600 bg-purple-50',
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
                    <span className="text-xs text-gray-400">{subtitle}</span>
                </div>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    {/* Minimalist dot indicator */}
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
        </div>
    );
}
