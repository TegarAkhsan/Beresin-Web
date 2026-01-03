import CountdownTimer from '@/Components/CountdownTimer';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function DashboardTab({ user, stats, activeTasks, openDetailModal, openUploadModal }) {
    // Workload Colors
    const getWorkloadColor = (status) => {
        switch (status) {
            case 'Green': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Red': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h2>

            {/* 1. Workload Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className={`p-6 rounded-2xl border ${getWorkloadColor(stats.workload_status)} shadow-sm relative overflow-hidden`}>
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Workload</h3>
                        <p className="text-2xl font-black">{stats.workload_status}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Rating</h3>
                    <p className="text-3xl font-bold text-gray-900">★ {stats.avg_rating}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">On-Time</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.on_time_rate}%</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Completed</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.total_completed} <span className="text-sm font-normal text-gray-400">tasks</span></p>
                </div>
            </div>

            {/* 2. Active Workspace */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Active Tasks</h3>
                    <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">{activeTasks.length}</span>
                </div>

                <div className="space-y-6">
                    {activeTasks.map(task => (
                        <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wide">
                                            #{task.order_number}
                                        </span>
                                        <span className="text-sm text-gray-500 font-medium">{task.package?.service?.name}</span>
                                    </div>

                                    <h4 className="text-2xl font-bold text-gray-900 mb-2 truncate leading-tight">
                                        {task.package?.name}
                                    </h4>

                                    <p className="text-gray-500 line-clamp-2 mb-6 text-sm">{task.description}</p>

                                    {/* Inline Detail Summary */}
                                    <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            <span className="font-semibold">{task.user?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            <span>{task.user?.email}</span>
                                        </div>
                                        <button
                                            onClick={() => openDetailModal(task)}
                                            className="ml-auto text-indigo-600 font-bold text-xs hover:underline"
                                        >
                                            View Full Details
                                        </button>
                                    </div>

                                    {/* Files */}
                                    {task.files?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {task.files.map(file => (
                                                <a href={`/storage/${file.file_path}`} target="_blank" key={file.id} className="group relative pr-8 pl-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 hover:border-indigo-300 transition-colors">
                                                    📄 {file.version_label}
                                                    <span className="absolute right-2 text-gray-300">⬇</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="md:w-72 flex flex-col gap-3 border-l border-gray-50 md:pl-8">
                                    <div className="text-center mb-2">
                                        <p className="text-xs text-gray-400 uppercase font-bold text-center mb-1">Deadline Countdown</p>
                                        <CountdownTimer deadline={task.deadline} />
                                    </div>
                                    <div className="space-y-2 w-full">
                                        <PrimaryButton onClick={() => openUploadModal(task)} className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 py-3">
                                            Sync / Upload
                                        </PrimaryButton>
                                        <SecondaryButton className="w-full justify-center py-3">
                                            Open Chat
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {activeTasks.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4 text-2xl">⚡</div>
                            <h3 className="text-lg font-bold text-gray-800">Available for work!</h3>
                            <p className="text-gray-500 mb-6">You have no active tasks. Check the "New Tasks" tab.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
