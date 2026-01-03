import { Link } from '@inertiajs/react';

const StatCard = ({ title, value, subtitle, icon, color }) => {
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
        indigo: 'bg-indigo-50 text-indigo-600'
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">{title}</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <p className="text-sm font-medium text-gray-400">{subtitle}</p>
        </div>
    );
};

export default function DashboardTab({ user, stats, activeTasks, openDetailModal, openUploadModal, CountdownTimer }) {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Dashboard</h1>
                <p className="text-lg text-gray-500">
                    Welcome back, <span className="text-gray-900 font-semibold">{user.name}</span>!
                </p>
            </header>

            {/* Workload Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Workload"
                    value={stats.workload_status}
                    subtitle="Current Status"
                    color="indigo"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
                />
                <StatCard
                    title="Rating"
                    value={`★ ${stats.avg_rating}`}
                    subtitle="Average Rating"
                    color="amber"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>}
                />
                <StatCard
                    title="On-Time"
                    value={`${stats.on_time_rate}%`}
                    subtitle="Completion Rate"
                    color="emerald"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                />
                <StatCard
                    title="Completed"
                    value={stats.total_completed}
                    subtitle="Total Tasks"
                    color="blue"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                />
            </div>

            {/* Active Tasks List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Active Tasks</h2>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                        {activeTasks.length} Pending
                    </span>
                </div>

                <div className="divide-y divide-gray-50">
                    {activeTasks.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4 text-2xl">⚡</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Available for work!</h3>
                            <p className="text-gray-500">You have no active tasks at the moment.</p>
                        </div>
                    ) : (
                        activeTasks.map(task => (
                            <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600">
                                            #{task.order_number}
                                        </span>
                                        <span className="text-sm text-indigo-600 font-medium">
                                            {task.package?.service?.name}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {task.package?.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-1 mb-4">
                                        Client: {task.user?.name}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => openDetailModal(task)}
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                                        >
                                            View Details
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            onClick={() => openUploadModal(task)}
                                            className="text-sm font-semibold text-gray-600 hover:text-gray-900 hover:underline"
                                        >
                                            Upload Result
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-center min-w-[150px]">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Deadline</p>
                                        {CountdownTimer && <CountdownTimer deadline={task.deadline} />}
                                    </div>
                                    <div className="mt-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            In Progress
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
