
export default function TasksTab({ upcomingTasks, reviewTasks, openPreviewModal }) {
    return (
        <div className="animate-fade-in-up space-y-8">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">New Assignments</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {upcomingTasks.map(task => (
                        <div key={task.id} onClick={() => openPreviewModal(task)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-500 cursor-pointer transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">NEW</span>
                                <span className="text-xs text-gray-500">{new Date(task.deadline).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors mb-2">{task.package?.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>
                            <div className="flex items-center text-sm font-bold text-indigo-600">
                                Review & Start <span className="ml-1">→</span>
                            </div>
                        </div>
                    ))}
                    {upcomingTasks.length === 0 && (
                        <div className="col-span-2 p-8 text-center text-gray-400 italic bg-white rounded-xl">No new tasks available.</div>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">In Review (Waiting Client)</h2>
                <div className="space-y-3">
                    {reviewTasks.map(task => (
                        <div key={task.id} className="bg-white p-6 rounded-2xl border-l-4 border-amber-400 shadow-sm">
                            <div className="flex justify-between">
                                <h4 className="font-bold text-gray-800">{task.package?.name}</h4>
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Under Review</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
