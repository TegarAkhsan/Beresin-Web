import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import JokiSidebar from './Joki/JokiSidebar';
import DashboardTab from './Joki/DashboardTab';
import TasksTab from './Joki/TasksTab';
import EarningsTab from './Joki/EarningsTab';

export default function JokiDashboard({ auth, upcomingTasks, activeTasks, reviewTasks, stats }) {
    // Tab state management
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Modal states
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewTask, setPreviewTask] = useState(null);
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

            <div className="flex min-h-screen bg-[#F8F9FC]">
                <JokiSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    user={auth.user}
                />

                <main className="flex-1 overflow-y-auto h-screen w-full md:pl-0">
                    {/* Header - Mobile Only or Minimalist */}
                    <header className="md:hidden bg-white/80 backdrop-blur-md sticky top-0 z-20 h-20 flex items-center justify-between px-6 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-gray-500 hover:text-gray-900 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                            <h2 className="font-bold text-lg text-gray-900">Joki Workspace</h2>
                        </div>
                    </header>

                    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                        {activeTab === 'dashboard' && (
                            <DashboardTab
                                user={auth.user}
                                stats={stats}
                                activeTasks={activeTasks}
                                openDetailModal={openDetailModal}
                                openUploadModal={openUploadModal}
                                CountdownTimer={CountdownTimer}
                            />
                        )}

                        {activeTab === 'tasks' && (
                            <TasksTab
                                upcomingTasks={upcomingTasks}
                                reviewTasks={reviewTasks}
                                openPreviewModal={openPreviewModal}
                            />
                        )}

                        {activeTab === 'earnings' && (
                            <EarningsTab stats={stats} />
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
