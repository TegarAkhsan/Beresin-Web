import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function JokiDashboard({ auth, upcomingTasks, activeTasks, reviewTasks, stats }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewTask, setPreviewTask] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

    // Workload Colors
    const getWorkloadColor = (status) => {
        switch (status) {
            case 'Green': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Red': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Countdown Timer Component
    const CountdownTimer = ({ deadline }) => {
        const calculateTimeLeft = () => {
            const difference = +new Date(deadline) - +new Date();
            let timeLeft = {};
            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                };
            } else {
                timeLeft = { expired: true };
            }
            return timeLeft;
        };

        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

        useEffect(() => {
            const timer = setTimeout(() => {
                setTimeLeft(calculateTimeLeft());
            }, 60000);
            return () => clearTimeout(timer);
        });

        if (timeLeft.expired) return <span className="text-red-600 font-bold">Overdue</span>;

        return (
            <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
            </span>
        );
    };

    // Task Preview & Start Logic
    const openPreviewModal = (task) => {
        setPreviewTask(task);
        setShowPreviewModal(true);
    };

    const closePreviewModal = () => {
        setShowPreviewModal(false);
        setPreviewTask(null);
    };

    const handleAcceptTask = () => {
        router.post(route('joki.orders.start', previewTask.id), {}, {
            onSuccess: () => {
                closePreviewModal();
                setActiveTab('dashboard');
            }
        });
    };

    // File Upload Form
    const { data, setData, post, processing, reset, errors } = useForm({
        file: null,
        version_label: 'Final v1',
        external_link: ''
    });

    const openUploadModal = (order) => {
        setSelectedOrder(order);
        setData('external_link', order.external_link || '');
        setShowUploadModal(true);
    };

    const closeUploadModal = () => {
        setShowUploadModal(false);
        reset();
    };

    const submitUpload = (e) => {
        e.preventDefault();
        post(route('joki.orders.upload', selectedOrder.id), {
            onSuccess: () => {
                reset('file', 'version_label');
                alert('File uploaded.');
            }
        });
    };

    const submitLink = (e) => {
        e.preventDefault();
        post(route('joki.orders.link', selectedOrder.id), {
            onSuccess: () => alert('Link updated.')
        });
    }

    const MenuItem = ({ id, label, icon }) => (
        <button
            onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
            className={`w-full text-left px-6 py-3 mb-1 flex items-center transition-colors ${activeTab === id
                    ? 'bg-indigo-50 border-r-4 border-indigo-600 text-indigo-700 font-bold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
        >
            <span className="mr-3">{icon}</span>
            {label}
        </button>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Note: HEADER prop removed as requested */}
            <Head title="Joki Dashboard" />

            <div className="flex min-h-screen bg-gray-100">
                {/* SIDEBAR */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-center h-20 border-b border-gray-100">
                        <h1 className="text-xl font-bold text-gray-800">Workspace</h1>
                    </div>
                    <nav className="mt-6">
                        <div className="px-6 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Main Menu
                        </div>
                        <MenuItem
                            id="dashboard"
                            label="Dashboard"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                        />
                        <MenuItem
                            id="tasks"
                            label="My Tasks"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
                        />
                        <MenuItem
                            id="earnings"
                            label="Earnings"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        />
                    </nav>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-gray-50/50">
                    {/* Mobile Sidebar Toggle */}
                    <div className="md:hidden flex items-center mb-6">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <span className="ml-4 font-bold text-gray-800">Workspace</span>
                    </div>

                    <div className="max-w-5xl mx-auto">

                        {activeTab === 'dashboard' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

                                {/* 1. Workload Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className={`p-6 rounded-xl border ${getWorkloadColor(stats.workload_status)} shadow-sm`}>
                                        <h3 className="text-sm font-bold uppercase tracking-wide opacity-80">Load Status</h3>
                                        <p className="text-3xl font-black mt-2">{stats.workload_status}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                        <h3 className="text-gray-400 text-xs font-bold uppercase">Rating</h3>
                                        <p className="text-3xl font-bold text-gray-800">★ {stats.avg_rating}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                        <h3 className="text-gray-400 text-xs font-bold uppercase">On-Time</h3>
                                        <p className="text-3xl font-bold text-gray-800">{stats.on_time_rate}%</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                        <h3 className="text-gray-400 text-xs font-bold uppercase">Completed</h3>
                                        <p className="text-3xl font-bold text-gray-800">{stats.total_completed}</p>
                                    </div>
                                </div>

                                {/* 2. Active Workspace */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                        Active Workspace
                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs">{activeTasks.length}</span>
                                    </h3>
                                    <div className="space-y-6">
                                        {activeTasks.map(task => (
                                            <div key={task.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">#{task.order_number}</span>
                                                            <span className="text-xs text-gray-400">{task.package?.service?.name}</span>
                                                        </div>
                                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{task.package?.name}</h4>
                                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">{task.description}</p>
                                                        </div>

                                                        {/* File Versions */}
                                                        {task.files?.length > 0 && (
                                                            <div className="flex gap-2 flex-wrap">
                                                                {task.files.map(file => (
                                                                    <a href={`/storage/${file.file_path}`} target="_blank" key={file.id} className="text-xs flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-indigo-600 hover:border-indigo-300 transition">
                                                                        <span className="opacity-50">📎</span> {file.version_label}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="md:w-64 flex flex-col gap-3">
                                                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-center">
                                                            <p className="text-xs text-blue-400 font-bold uppercase mb-1">Time Left</p>
                                                            <div className="text-2xl font-mono text-blue-700">
                                                                <CountdownTimer deadline={task.deadline} />
                                                            </div>
                                                        </div>
                                                        <PrimaryButton onClick={() => openUploadModal(task)} className="justify-center w-full bg-indigo-600">
                                                            Sync / Upload
                                                        </PrimaryButton>
                                                        <SecondaryButton className="justify-center w-full">Open Chat</SecondaryButton>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {activeTasks.length === 0 && (
                                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                                <div className="text-gray-300 text-4xl mb-3">☕</div>
                                                <p className="text-gray-500 font-medium">No active tasks. Good job!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tasks' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Task Center</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Upcoming */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-gray-700">Available Tasks</h3>
                                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{upcomingTasks.length}</span>
                                        </div>
                                        {upcomingTasks.map(task => (
                                            <div
                                                key={task.id}
                                                onClick={() => openPreviewModal(task)}
                                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className="text-xs text-indigo-500 font-bold tracking-wider uppercase mb-1 block">New Assignment</span>
                                                        <h4 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">{task.package?.name}</h4>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{task.description}</p>
                                                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                                    <span className="text-indigo-600 text-xs font-bold flex items-center group-hover:translate-x-1 transition-transform">
                                                        Review & Accept →
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {upcomingTasks.length === 0 && <p className="text-gray-400 italic text-sm text-center py-8">No new assignments available.</p>}
                                    </div>

                                    {/* Review Queue */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-gray-700">In Review</h3>
                                            <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{reviewTasks.length}</span>
                                        </div>
                                        {reviewTasks.map(task => (
                                            <div key={task.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-purple-400">
                                                <h4 className="font-bold text-gray-800">{task.package?.name}</h4>
                                                <span className="text-xs text-gray-500 block mb-2">{task.package?.service?.name}</span>
                                                <div className="mt-3 flex items-center text-xs text-purple-600 font-medium bg-purple-50 p-2 rounded">
                                                    <span className="mr-2 animate-pulse">●</span> Waiting for client feedback...
                                                </div>
                                            </div>
                                        ))}
                                        {reviewTasks.length === 0 && <p className="text-gray-400 italic text-sm text-center py-8">Review queue is empty.</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'earnings' && (
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
                                <div className="border-t pt-6 text-center text-gray-500 text-sm">
                                    Comparison and withdrawal history features are under development.
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* MODALS */}

            {/* 1. Preview Modal */}
            <Modal show={showPreviewModal} onClose={closePreviewModal}>
                <div className="p-6">
                    {previewTask && (
                        <>
                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Job Opportunity</span>
                                    <h2 className="text-2xl font-bold text-gray-800 mt-1">{previewTask.package?.name}</h2>
                                    <p className="text-indigo-600 font-medium text-sm mt-1">{previewTask.package?.service?.name}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-gray-800">Rp {new Intl.NumberFormat('id-ID').format(previewTask.amount)}</span>
                                    <span className="text-xs text-gray-400">Estimated payout</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                                <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Client Brief</h3>
                                <p className="text-gray-600 text-sm leading-7 whitespace-pre-wrap">
                                    {previewTask.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 bg-red-50 p-4 rounded-xl border border-red-100 mb-8">
                                <div className="text-red-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-red-400 uppercase">Strict Deadline</p>
                                    <p className="font-bold text-red-700">{new Date(previewTask.deadline).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse md:flex-row justify-end gap-3">
                                <SecondaryButton onClick={closePreviewModal} className="justify-center">Cancel</SecondaryButton>
                                <PrimaryButton onClick={handleAcceptTask} className="justify-center bg-emerald-600 hover:bg-emerald-700 h-10 px-8">
                                    Accept Assignment
                                </PrimaryButton>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* 2. Upload Modal */}
            <Modal show={showUploadModal} onClose={closeUploadModal}>
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sync Deliverables</h2>

                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                            1. External Resource Link
                            <span className="block font-normal text-xs text-gray-400 mt-1">Figma, Google Drive, GitHub Repository</span>
                        </label>
                        <form onSubmit={submitLink} className="flex gap-2">
                            <TextInput
                                type="url"
                                className="flex-1"
                                placeholder="https://..."
                                value={data.external_link}
                                onChange={(e) => setData('external_link', e.target.value)}
                            />
                            <SecondaryButton type="submit">Save Link</SecondaryButton>
                        </form>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                            2. Upload Source File
                            <span className="block font-normal text-xs text-gray-400 mt-1">Zip, Rar, PDF, or Final Project File</span>
                        </label>
                        <form onSubmit={submitUpload}>
                            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors mb-4 cursor-pointer group">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                />
                                <div className="text-gray-400 group-hover:text-indigo-500">
                                    <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="text-sm font-medium">{data.file ? data.file.name : "Click or Drag file here"}</p>
                                </div>
                            </div>
                            {errors.file && <div className="text-red-500 text-sm mb-4">{errors.file}</div>}

                            <div className="mb-6">
                                <InputLabel value="Version Label" className="mb-2" />
                                <TextInput
                                    type="text"
                                    className="w-full"
                                    placeholder="e.g. Final Revision v2"
                                    value={data.version_label}
                                    onChange={(e) => setData('version_label', e.target.value)}
                                />
                                {errors.version_label && <div className="text-red-500 text-sm mt-1">{errors.version_label}</div>}
                            </div>

                            <div className="flex justify-end gap-3">
                                <SecondaryButton onClick={closeUploadModal}>Cancel</SecondaryButton>
                                <PrimaryButton disabled={processing} className="bg-indigo-600">Submit Deliverables</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
