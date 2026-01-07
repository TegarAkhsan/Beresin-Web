import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Dashboard({ auth, stats, joki_workload, payoutRequests = [] }) {
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedPayout, setSelectedPayout] = useState(null);

    // Process Form
    const { data: processData, setData: setProcessData, post: postProcess, processing: processProcessing, reset: resetProcess } = useForm({
        proof_file: null
    });

    // Reject Form
    const { data: rejectData, setData: setRejectData, post: postReject, processing: rejectProcessing, reset: resetReject } = useForm({
        reason: ''
    });

    const openProcessModal = (payout) => {
        setSelectedPayout(payout);
        resetProcess();
        setProcessModalOpen(true);
    };

    const openRejectModal = (payout) => {
        setSelectedPayout(payout);
        resetReject();
        setRejectModalOpen(true);
    };

    const handleProcess = (e) => {
        e.preventDefault();
        postProcess(route('admin.payouts.process', selectedPayout.id), {
            onSuccess: () => setProcessModalOpen(false)
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        postReject(route('admin.payouts.reject', selectedPayout.id), {
            onSuccess: () => setRejectModalOpen(false)
        });
    };

    return (
        <AdminLayout user={auth.user} header="Overview">
            <Head title="Admin Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Gross Revenue" value={`Rp ${new Intl.NumberFormat('id-ID').format(stats.revenue_gross)}`} subtitle="Lifetime Total" color="blue" />
                <StatCard title="Admin Earnings" value={`Rp ${new Intl.NumberFormat('id-ID').format(stats.revenue_admin)}`} subtitle="Net Profit" color="emerald" />
                <StatCard title="Ops Fund" value={`Rp ${new Intl.NumberFormat('id-ID').format(stats.revenue_ops)}`} subtitle="Operational" color="amber" />
                <StatCard title="Active Jokis" value={stats.total_jokis} subtitle="Staff Count" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Payout Requests */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Payout Requests</h3>
                        <span className="px-3 py-1 bg-gray-50 text-xs font-semibold text-gray-500 rounded-full">
                            {payoutRequests.filter(p => p.status === 'pending').length} Pending
                        </span>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Joki</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Bank Details</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payoutRequests.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No payout requests found.</td></tr>
                                ) : (
                                    payoutRequests.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{payout.user?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">
                                                Rp {new Intl.NumberFormat('id-ID').format(payout.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-500">
                                                    <p><span className="font-bold">{payout.bank_details_snapshot?.bank_name}</span></p>
                                                    <p>{payout.bank_details_snapshot?.account_number}</p>
                                                    <p>{payout.bank_details_snapshot?.account_holder}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${payout.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        payout.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {payout.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {payout.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => openProcessModal(payout)} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs">Process</button>
                                                        <button onClick={() => openRejectModal(payout)} className="text-red-400 hover:text-red-600 font-bold text-xs">Reject</button>
                                                    </div>
                                                )}
                                                {payout.status === 'paid' && (
                                                    <a href={`/storage/${payout.proof_file}`} target="_blank" className="text-indigo-500 hover:underline text-xs">View Proof</a>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Joki Workload */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-fit">
                    <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Joki Workload</h3>
                        <span className="px-3 py-1 bg-gray-50 text-xs font-semibold text-gray-500 rounded-full">Top 5 Active</span>
                    </div>
                    <div className="p-2 flex-1">
                        {joki_workload.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {joki_workload.map((joki) => (
                                    <div key={joki.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-xl transition">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                                {joki.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{joki.name}</div>
                                                <div className="text-xs text-gray-500">{joki.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold text-gray-900">{joki.active_jobs_count} Tasks</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">No active jokis found.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* PROCESS MODAL */}
            <Modal show={processModalOpen} onClose={() => setProcessModalOpen(false)}>
                <form onSubmit={handleProcess} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Process Payout</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Please transfer <strong>Rp {new Intl.NumberFormat('id-ID').format(selectedPayout?.amount || 0)}</strong> to:<br />
                        {selectedPayout?.bank_details_snapshot?.bank_name} - {selectedPayout?.bank_details_snapshot?.account_number} ({selectedPayout?.bank_details_snapshot?.account_holder})
                    </p>

                    <div className="mb-4">
                        <InputLabel value="Upload Proof of Transfer" />
                        <input
                            type="file"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={(e) => setProcessData('proof_file', e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <SecondaryButton onClick={() => setProcessModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processProcessing}>Confirm Payment</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* REJECT MODAL */}
            <Modal show={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
                <form onSubmit={handleReject} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Reject Payout</h2>
                    <div className="mb-4">
                        <InputLabel value="Reason for Rejection" />
                        <TextInput
                            className="w-full mt-1"
                            value={rejectData.reason}
                            onChange={(e) => setRejectData('reason', e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <SecondaryButton onClick={() => setRejectModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton className="bg-red-600 hover:bg-red-700" disabled={rejectProcessing}>Reject Request</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}

function StatCard({ title, value, subtitle, color }) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        amber: 'text-amber-600 bg-amber-50',
        emerald: 'text-emerald-600 bg-emerald-50',
        purple: 'text-purple-600 bg-purple-50',
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
                    <span className="text-xs text-gray-400">{subtitle}</span>
                </div>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    {/* Minimalist dot indicator */}
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
        </div>
    );
}
