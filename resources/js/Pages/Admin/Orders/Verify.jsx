import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Verify({ auth, orders }) {
    const [confirmingApproval, setConfirmingApproval] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { post, processing } = useForm();

    const confirmApprove = (order) => {
        setSelectedOrder(order);
        setConfirmingApproval(true);
    };

    const closeModal = () => {
        setConfirmingApproval(false);
        setSelectedOrder(null);
    };

    const approveOrder = () => {
        post(route('admin.orders.approve', selectedOrder.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Verify Payments</h2>}
        >
            <Head title="Verify Payments" />

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Service</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Proof</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.data.map((order) => (
                                    <tr key={order.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{order.order_number || `#${order.id}`}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.user.name}</div>
                                            <div className="text-xs text-gray-500">{order.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
                                                {order.package?.service?.name} - {order.package?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            Rp {new Intl.NumberFormat('id-ID').format(order.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.payment_proof ? (
                                                <a href={'/storage/' + order.payment_proof} target="_blank" className="text-blue-600 underline hover:text-blue-800">
                                                    View Proof
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic">No proof</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => confirmApprove(order)}
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition shadow-sm"
                                            >
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {orders.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No pending payments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={confirmingApproval} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Approve Payment?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Are you sure you want to approve this payment for Order <span className="font-bold">{selectedOrder?.order_number}</span>?
                        This will generate an invoice number and move the order to the assignment queue.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="bg-green-600 hover:bg-green-700" onClick={approveOrder} disabled={processing}>
                            Approve Payment
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
