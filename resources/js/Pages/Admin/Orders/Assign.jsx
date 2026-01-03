import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';

export default function Assign({ auth, orders, assignedOrders, jokis, filters }) { // filters added
    const { data, setData, post, processing, errors, reset } = useForm({
        joki_id: '',
    });

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

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

    const openAssignModal = (order) => {
        setSelectedOrder(order);
        setData('joki_id', '');
    };

    const closeAssignModal = () => {
        setSelectedOrder(null);
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
                        <h3 className="text-lg font-bold mb-4 text-amber-600 flex items-center">
                            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                            Pending Assignments
                        </h3>
                        <div className="overflow-x-auto">
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
                                                    onClick={() => openAssignModal(order)}
                                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
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
                        <div className="overflow-x-auto">
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

            {/* Assign Modal */}
            <Modal show={!!selectedOrder} onClose={closeAssignModal}>
                <form onSubmit={handleAssign} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Assign Joki for Order #{selectedOrder?.order_number}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Select a Joki to allow them to start working on this task.
                        <br />
                        <span className="font-semibold">Service:</span> {selectedOrder?.package?.service?.name} - {selectedOrder?.package?.name}
                    </p>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Joki</label>
                        <select
                            value={data.joki_id}
                            onChange={(e) => setData('joki_id', e.target.value)}
                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        >
                            <option value="">-- Choose Joki --</option>
                            {jokis.map((joki) => (
                                <option key={joki.id} value={joki.id} disabled={joki.jobs_count >= 5}>
                                    {joki.name} ({joki.jobs_count} active tasks)
                                </option>
                            ))}
                        </select>
                        {errors.joki_id && <div className="text-red-600 text-sm mt-1">{errors.joki_id}</div>}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeAssignModal}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing}>Confirm Assignment</PrimaryButton>
                    </div>
                </form>
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
