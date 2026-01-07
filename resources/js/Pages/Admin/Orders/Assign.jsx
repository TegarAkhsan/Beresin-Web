import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import ConfirmationModal from '@/Components/ConfirmationModal'; // Added this import
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';

export default function Assign({ auth, orders, assignedOrders, jokis, filters }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        assignment_type: 'manual',
        joki_id: '',
    });

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [assignmentMethod, setAssignmentMethod] = useState(null); // 'manual' or 'auto'

    // Auto-Search with Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('admin.orders.assign'),
                { search: search },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true, // Replace history to avoid back-button spam
                }
            );
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [search]);

    const openAssignModal = (order, method = null) => {
        setSelectedOrder(order);
        setAssignmentMethod(method);
        setData({
            assignment_type: method || 'manual',
            joki_id: '',
        });
    };

    const handleAutoAssign = () => {
        router.post(route('admin.orders.store_assignment', selectedOrder.id), {
            assignment_type: 'auto',
            // No fee needed for auto, backend handles it
        }, {
            preserveScroll: true,
            onSuccess: () => {
                closeAssignModal();
                // Toast handles it
            },
        });
    };

    // State for Confirmation Modal
    const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);

    // Open Confirmation
    const handleBatchAutoAssign = () => {
        setShowAutoAssignModal(true);
    };

    // Execute Batch Assign
    const confirmBatchAutoAssign = () => {
        router.post(route('admin.orders.batch_auto_assign'), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAutoAssignModal(false);
                // Toast in AdminLayout handles the notification automatically via flash prop
            },
            onError: (errors) => {
                console.error(errors);
                setShowAutoAssignModal(false);
                alert('An error occurred during auto-assignment.');
            },
            onFinish: () => setShowAutoAssignModal(false),
        });
    };

    const closeAssignModal = () => {
        setSelectedOrder(null);
        setAssignmentMethod(null);
        reset();
    };

    const handleAssign = (e) => {
        e.preventDefault();
        post(route('admin.orders.store_assignment', selectedOrder.id), {
            onSuccess: () => closeAssignModal(),
        });
    };

    const [selectedJoki, setSelectedJoki] = useState(null);
    const [selectedJokiJob, setSelectedJokiJob] = useState(null); // Detail view for specific job inside modal

    const openJokiModal = (joki) => {
        setSelectedJoki(joki);
        setSelectedJokiJob(null); // Reset detail view
    };

    const closeJokiModal = () => {
        setSelectedJoki(null);
        setSelectedJokiJob(null);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Assign Tasks</h2>}
        >
            <Head title="Assign Tasks" />

            {/* Joki Workload Stats - Clickable */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {jokis.map((joki) => (
                    <div
                        key={joki.id}
                        onClick={() => openJokiModal(joki)}
                        className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl p-5 border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow group"
                    >
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">{joki.name}</h3>
                            <p className="text-sm text-gray-500">Active Tasks</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-110
                            ${joki.jobs_count >= 5 ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600'}
                        `}>
                            {joki.jobs_count}
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <TextInput
                    className="w-full md:w-1/3"
                    placeholder="Search order ID, customer, package, or joki..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Pending Assignments */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg h-fit">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-amber-600 flex items-center">
                                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                                Pending Assignments
                            </h3>

                            {/* Header Buttons: Manual / Auto */}
                            <div className="flex gap-2">
                                {orders.data.length > 0 && (
                                    <>
                                        <button
                                            onClick={handleBatchAutoAssign}
                                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1"
                                            title="Assign all pending orders automatically"
                                        >
                                            <span className="hidden sm:inline">🤖</span> Auto
                                        </button>

                                        <ConfirmationModal
                                            show={showAutoAssignModal}
                                            title="Run Batch Auto-Assign?"
                                            message={`This will automatically assign all ${orders.data.length} pending orders to the most suitable Jokis based on workload and specialization (Web/UI/Mobile). Are you sure?`}
                                            confirmText="Yes, Auto Assign"
                                            onConfirm={confirmBatchAutoAssign}
                                            onClose={() => setShowAutoAssignModal(false)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile Card View (Pending) */}
                        <div className="md:hidden space-y-4">
                            {orders.data.length === 0 ? (
                                <div className="text-center py-6 text-gray-500 text-sm">No pending orders.</div>
                            ) : (
                                orders.data.map((order) => (
                                    <div key={order.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{order.order_number || `#${order.id}`}</h4>
                                                <p className="text-xs text-purple-600 font-semibold mt-0.5">{order.package?.service?.name}</p>
                                            </div>
                                            <div className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">PAID</div>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3">{order.user.name}</p>
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                            <span className="text-xs text-gray-500">
                                                Due: <span className="font-medium text-gray-700">{order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}</span>
                                            </span>
                                            <button
                                                onClick={() => openAssignModal(order, 'manual')}
                                                className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold uppercase tracking-wider"
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop Table View (Pending) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Order Info</th>
                                        <th className="px-4 py-3">Deadline</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.map((order) => (
                                        <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{order.order_number || `#${order.id}`}</div>
                                                <div className="text-xs text-purple-600 font-semibold">{order.package?.service?.name}</div>
                                                <div className="text-xs text-gray-500">{order.user.name}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}
                                                <div className="text-xs text-emerald-600 font-bold mt-1">PAID</div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    onClick={() => openAssignModal(order, 'manual')}
                                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase tracking-wider transition shadow-sm"
                                                >
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.data.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                                No pending orders.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Assigned / In Progress */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg h-fit">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <h3 className="text-lg font-bold mb-4 text-blue-600 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            In Progress / Assigned
                        </h3>

                        {/* Mobile Card View (Assigned) */}
                        <div className="md:hidden space-y-4">
                            {(!assignedOrders?.data || assignedOrders.data.length === 0) ? (
                                <div className="text-center py-6 text-gray-500 text-sm">No active tasks found.</div>
                            ) : (
                                assignedOrders.data.map((order) => (
                                    <div key={order.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{order.order_number || `#${order.id}`}</h4>
                                                <p className="text-xs text-gray-500">{order.package?.service?.name}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full font-semibold
                                                ${order.status === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}
                                            `}>
                                                {order.status === 'review' ? 'Review' : 'Working'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                                {order.joki?.name.charAt(0)}
                                            </div>
                                            <span className="text-sm text-gray-700">{order.joki?.name}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop Table View (Assigned) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Order</th>
                                        <th className="px-4 py-3">Joki</th>
                                        <th className="px-4 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedOrders?.data.map((order) => ( // Use optional chaining
                                        <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{order.order_number || `#${order.id}`}</div>
                                                <div className="text-xs text-gray-500">{order.package?.service?.name}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                                        {order.joki?.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm text-gray-700">{order.joki?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className={`px-2 py-1 text-xs rounded-full font-semibold
                                                    ${order.status === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}
                                                `}>
                                                    {order.status === 'review' ? 'Review' : 'Working'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!assignedOrders?.data || assignedOrders.data.length === 0) && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                                No active tasks found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Modal - Multi-Step */}
            <Modal show={!!selectedOrder} onClose={closeAssignModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Assign Order #{selectedOrder?.order_number}
                    </h2>

                    {/* Step 1: Method Selection */}
                    {!assignmentMethod && (
                        <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                                Choose how you would like to assign this task.
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setAssignmentMethod('manual')}
                                    className="group flex items-center justify-between p-4 border-2 border-indigo-100 hover:border-indigo-500 rounded-xl bg-indigo-50 hover:bg-white transition-all shadow-sm hover:shadow-md"
                                >
                                    <div className="text-left">
                                        <h3 className="font-bold text-indigo-700 group-hover:text-indigo-600">Manual Assignment</h3>
                                        <p className="text-xs text-indigo-600/70">Select a specific Joki and set the fee manually.</p>
                                    </div>
                                    <span className="text-2xl">👉</span>
                                </button>

                                <button
                                    onClick={() => setAssignmentMethod('auto')}
                                    className="group flex items-center justify-between p-4 border-2 border-teal-100 hover:border-teal-500 rounded-xl bg-teal-50 hover:bg-white transition-all shadow-sm hover:shadow-md"
                                >
                                    <div className="text-left">
                                        <h3 className="font-bold text-teal-700 group-hover:text-teal-600">Auto Assignment</h3>
                                        <p className="text-xs text-teal-600/70">System selects the least busy Joki automatically.</p>
                                    </div>
                                    <span className="text-2xl">🤖</span>
                                </button>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={closeAssignModal}>Cancel</SecondaryButton>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Manual Assignment Form */}
                    {assignmentMethod === 'manual' && (
                        <form onSubmit={handleAssign}>
                            <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">Service:</span> {selectedOrder?.package?.service?.name} - {selectedOrder?.package?.name}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Joki Selection - Card Grid */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Joki</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
                                        {jokis.map((joki) => {
                                            const isSelected = parseInt(data.joki_id) === joki.id;
                                            const isFull = joki.jobs_count >= 5;

                                            return (
                                                <div
                                                    key={joki.id}
                                                    onClick={() => !isFull && setData('joki_id', joki.id)}
                                                    className={`
                                                    relative rounded-xl p-4 border transition-all cursor-pointer flex items-center justify-between
                                                    ${isSelected
                                                            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50 dark:bg-indigo-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:shadow-sm bg-white dark:bg-gray-800'}
                                                    ${isFull ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                                                `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                                                        ${isSelected ? 'bg-indigo-600' : 'bg-gray-400'}
                                                    `}>
                                                            {joki.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className={`font-semibold text-sm ${isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'}`}>
                                                                {joki.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">
                                                                {joki.jobs_count} tasks active
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Selection Indicator */}
                                                    {isSelected && (
                                                        <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {errors.joki_id && <div className="text-red-600 text-sm mt-1">{errors.joki_id}</div>}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <SecondaryButton onClick={() => setAssignmentMethod(null)}>Back</SecondaryButton>
                                <PrimaryButton disabled={processing}>Confirm Manual Assignment</PrimaryButton>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Auto Assignment Confirmation */}
                    {assignmentMethod === 'auto' && (
                        <div>
                            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                                <h4 className="font-bold text-teal-800 mb-2">How Auto-Assign Works</h4>
                                <p className="text-sm text-teal-700 mb-2">
                                    The system will search for a Joki with the <strong>lowest number of active tasks</strong> (Working + Review).
                                </p>
                                <p className="text-sm text-teal-700">
                                    If multiple Jokis are tied, one will be chosen randomly.
                                </p>
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">⚠️</div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            The Joki Fee will be set to <strong>Rp 0</strong> initially. You may need to edit it later if required.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <SecondaryButton onClick={() => setAssignmentMethod(null)}>Back</SecondaryButton>
                                <button
                                    onClick={handleAutoAssign}
                                    className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-700 focus:bg-teal-700 active:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Confirm Auto Assign
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Joki Tasks Details Modal */}
            <Modal show={!!selectedJoki} onClose={closeJokiModal} maxWidth="2xl">
                <div className="p-6">
                    {!selectedJokiJob ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Current Tasks - {selectedJoki?.name}
                                </h2>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                    {selectedJoki?.jobs?.length || 0} Active
                                </span>
                            </div>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {selectedJoki?.jobs?.length > 0 ? (
                                    selectedJoki.jobs.map((job) => (
                                        <div
                                            key={job.id}
                                            onClick={() => setSelectedJokiJob(job)}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-400 cursor-pointer transition-colors group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 transition-colors">
                                                        {job.order_number || `#${job.id}`}
                                                    </p>
                                                    <div className="mt-1">
                                                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                                            {job.package?.name || 'Paket Custom'}
                                                        </span>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {job.package?.service?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xs px-2 py-1 rounded font-medium inline-block mb-1
                                                        ${job.status === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}
                                                    `}>
                                                        {job.status === 'review' ? 'Review' : 'Working'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Click for details →</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500 italic">
                                        No active tasks currently assigned.
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={closeJokiModal}>Close</SecondaryButton>
                            </div>
                        </>
                    ) : (
                        // Detailed View
                        <>
                            <div className="flex items-center gap-2 mb-6">
                                <button onClick={() => setSelectedJokiJob(null)} className="text-gray-400 hover:text-gray-600">
                                    ← Back
                                </button>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 ml-2">
                                    Order Details: {selectedJokiJob.order_number}
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Customer Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="block text-gray-400 text-xs">Name</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedJokiJob.user?.name}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-xs">Email</span>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{selectedJokiJob.user?.email}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-xs">Phone</span>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{selectedJokiJob.user?.phone || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-xs">University</span>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{selectedJokiJob.user?.university || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Package & Order Info */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Service & Package Details</h3>
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-indigo-600 font-bold text-lg">{selectedJokiJob.package?.name}</span>
                                            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">{selectedJokiJob.package?.service?.name}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{selectedJokiJob.package?.description}</p>

                                        {/* Features List */}
                                        {selectedJokiJob.package?.features && Array.isArray(selectedJokiJob.package.features) && (
                                            <ul className="text-xs text-gray-500 list-disc list-inside mt-2 bg-white dark:bg-gray-800 p-2 rounded">
                                                {selectedJokiJob.package.features.map((f, i) => (
                                                    <li key={i}>{f}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Task Notes */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Task Instructions / Notes</h3>
                                    <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 p-4 rounded-lg text-sm whitespace-pre-wrap border border-amber-100">
                                        {selectedJokiJob.description || 'No specific instructions provided.'}
                                    </div>
                                </div>

                                <div className="text-right text-xs text-gray-400">
                                    Deadline: <span className="font-mono text-gray-600 dark:text-gray-300 font-bold">{new Date(selectedJokiJob.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={closeJokiModal}>Close</SecondaryButton>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </AdminLayout>
    );
}
