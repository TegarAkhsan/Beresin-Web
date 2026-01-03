import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Detailed Task View Modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailTask, setDetailTask] = useState(null);

    const openDetailModal = (task) => {
        setDetailTask(task);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setDetailTask(null);
        setShowDetailModal(false);
    };

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

        if (timeLeft.expired) return <span className="text-red-500 font-bold text-xs uppercase">Expired</span>;

        return (
            <span className="font-mono text-xl font-bold text-blue-600">
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
        external_link: '',
        note: ''
    });

    const openUploadModal = (order) => {
        setSelectedOrder(order);
        setData({
            file: null,
            version_label: 'Final v1',
            external_link: order.external_link || '',
            note: ''
        });
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
                reset('file', 'version_label', 'note');
                alert('File uploaded successfully.');
                closeUploadModal();
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
            className={`w-full text-left px-6 py-4 flex items-center transition-colors ${activeTab === id
                ? 'bg-gray-100 border-r-4 border-indigo-600 text-indigo-700 font-bold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
        >
            <span className="mr-3">{icon}</span>
            {label}
        </button>
    );

    return (
        <AuthenticatedLayout user={auth.user} hideNavigation={true}>
            <Head title="Joki Dashboard" />

            <div className="flex min-h-screen bg-gray-50">
                {/* SIDEBAR */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col justify-between`}>
                    <div>
                        <div className="flex items-center justify-center h-20 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                                <h1 className="text-xl font-bold text-gray-800">Workspace</h1>
                            </div>
                        </div>

                        <nav className="mt-6 space-y-1">
                            <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Menu
                            </div>
                            <MenuItem
                                id="dashboard"
                                label="Dashboard & Active"
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                            />
                            <MenuItem
                                id="tasks"
                                label="New Tasks"
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                            />
                            <MenuItem
                                id="earnings"
                                label="Earnings"
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                            />
                        </nav>
                    </div>

                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                        <div className="flex items-center min-w-0 gap-3 mb-4 p-2">

                            <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{auth.user.name}</p>
                                <p className="text-xs text-gray-400 truncate text-indigo-500 font-medium tracking-wide">JOKI PRO</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.post(route('logout'))}
                            className="w-full text-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-bold"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Log Out
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto h-screen bg-gray-50 p-6 md:p-10">
                    {/* Mobile Sidebar Toggle */}
                    <div className="md:hidden flex items-center justify-between mb-8">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-700 bg-white p-2 rounded shadow">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <h1 className="font-bold text-gray-800">Workspace</h1>
                        <div className="w-10"></div>
                    </div>

                    <div className="max-w-6xl mx-auto">

                        {activeTab === 'dashboard' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Welcome back, {auth.user.name.split(' ')[0]}!</h2>

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
                        )}

                        {/* ... (Tasks Tab and Earnings Tab kept mostly same for brevity, can re-include if needed, but primarily layout change is outer shell) ... */}
                        {activeTab === 'tasks' && (
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
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                                <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Client Brief</h3>
                                <p className="text-gray-600 text-sm leading-7 whitespace-pre-wrap">
                                    {previewTask.description}
                                </p>
                            </div>

                            {/* Features in Preview */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Package Features</h3>
                                <ul className="grid grid-cols-2 gap-2">
                                    {previewTask.package?.features?.map((feature, index) => (
                                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                            <span className="text-green-500">✓</span> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-end gap-3">
                                <SecondaryButton onClick={closePreviewModal}>Cancel</SecondaryButton>
                                <PrimaryButton onClick={handleAcceptTask} className="bg-emerald-600 hover:bg-emerald-700">
                                    Accept Assignment
                                </PrimaryButton>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* 2. Detail Modal (Active Tasks) */}
            <Modal show={showDetailModal} onClose={closeDetailModal}>
                <div className="p-6">
                    {detailTask && (
                        <>
                            <div className="border-b pb-4 mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                                <p className="text-sm text-gray-500">Order #{detailTask.order_number}</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2">Customer Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase">Name</p>
                                                <p className="font-semibold">{detailTask.user?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase">Email</p>
                                                <p className="font-semibold">{detailTask.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* New: Package Details / Features */}
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-3">Package Deliverables</h3>
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
                                        <div className="flex justify-between items-center mb-4 border-b border-indigo-100 pb-3">
                                            <div>
                                                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider block mb-1">Package Type</span>
                                                <span className="block font-bold text-gray-800 text-lg">{detailTask.package?.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Payout</span>
                                                <span className="font-bold text-gray-800">Rp {new Intl.NumberFormat('id-ID').format(detailTask.amount)}</span>
                                            </div>
                                        </div>


                                        <h4 className="text-xs font-bold text-indigo-600 uppercase mb-3">Included Features</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Array.isArray(detailTask.package?.features) && detailTask.package.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded border border-indigo-100 shadow-sm">
                                                    <span className="text-indigo-500 mt-0.5">✓</span>
                                                    <span className="leading-tight">{feature}</span>
                                                </li>
                                            ))}
                                            {(!Array.isArray(detailTask.package?.features) || detailTask.package.features.length === 0) && (
                                                <li className="text-sm text-gray-400 italic">No specific features listed for this package.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2">Instructions / Brief</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-200">
                                        {detailTask.description}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <SecondaryButton onClick={closeDetailModal}>Close Details</SecondaryButton>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* 3. Upload Modal */}
            <Modal show={showUploadModal} onClose={closeUploadModal}>
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sync Deliverables</h2>

                    {/* Link Form */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                            1. External Resource Link
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

                    {/* File Form with NOTE */}
                    <div className="border-t border-gray-100 pt-8">
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                            2. Upload Source File & Notes
                        </label>
                        <form onSubmit={submitUpload}>
                            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors mb-4 cursor-pointer group">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                />
                                <div className="text-gray-400 group-hover:text-indigo-500">
                                    <p className="text-sm font-medium">{data.file ? data.file.name : "Click or Drag file here (Max 10MB)"}</p>
                                </div>
                            </div>
                            {errors.file && <div className="text-red-500 text-sm mb-4">{errors.file}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
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
                            </div>

                            <div className="mb-6">
                                <InputLabel value="Note / Catatan (Optional)" className="mb-2" />
                                <textarea
                                    className="block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                    rows="3"
                                    placeholder="Add notes about this version..."
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                ></textarea>
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
