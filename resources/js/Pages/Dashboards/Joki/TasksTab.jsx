import { Link } from '@inertiajs/react';

export default function TasksTab({ upcomingTasks, reviewTasks, openPreviewModal }) {
    return (
        <div className="space-y-10 animate-fade-in-up">

            {/* NEW ASSIGNMENTS */}
            <div>
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">New Assignments</h2>
                        <p className="text-sm text-gray-500 mt-1">Pick your next task from the available pool.</p>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingTasks.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                            <span className="text-4xl block mb-3">📭</span>
                            <h3 className="text-lg font-semibold text-gray-900">No new tasks available</h3>
                            <p className="text-gray-500">Check back later for new opportunities.</p>
                        </div>
                    ) : (
                        upcomingTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => openPreviewModal(task)}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <svg className="w-24 h-24 text-indigo-600 transform rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                                </div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wide rounded border border-indigo-100">
                                        New
                                    </span>
                                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors relative z-10 line-clamp-1">
                                    {task.package?.name}
                                </h3>

                                <p className="text-sm text-gray-500 mb-6 line-clamp-2 relative z-10 h-10">
                                    {task.description || 'No description provided.'}
                                </p>

                                <div className="flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 relative z-10">
                                    Review & Accept
                                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* IN REVIEW */}
            <div>
                <header className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">In Review</h2>
                    <p className="text-sm text-gray-500 mt-1">Tasks submitted and waiting for client approval.</p>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {reviewTasks.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 italic">No tasks currently under review.</div>
                        ) : (
                            reviewTasks.map(task => (
                                <div key={task.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base mb-0.5">{task.package?.name}</h4>
                                            <p className="text-xs text-gray-500 font-mono">ID: #{task.order_number}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wide rounded-full border border-amber-100">
                                        Waiting Approval
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
