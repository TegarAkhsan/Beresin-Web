import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState, useEffect } from 'react';

export default function EarningsTab({ stats, financials }) {
    const { available_balance, available_orders, payout_history, bank_details } = financials || {};

    // Payout Settings Form
    const { data: settingsData, setData: setSettingsData, post: postSettings, processing: settingsProcessing } = useForm({
        bank_name: bank_details?.bank_name || '',
        account_number: bank_details?.account_number || '',
        account_holder: bank_details?.account_holder || '',
    });

    // Payout Request Form
    const { data: requestData, setData: setRequestData, post: postRequest, processing: requestProcessing, errors: requestErrors } = useForm({
        order_ids: []
    });

    const handleUpdateSettings = (e) => {
        e.preventDefault();
        postSettings(route('joki.payout.settings'));
    };

    const handleRequestPayout = (e) => {
        e.preventDefault();
        postRequest(route('joki.payout.request'), {
            onSuccess: () => setRequestData('order_ids', []),
        });
    };

    const toggleOrderSelection = (id) => {
        const current = requestData.order_ids;
        if (current.includes(id)) {
            setRequestData('order_ids', current.filter(cid => cid !== id));
        } else {
            setRequestData('order_ids', [...current, id]);
        }
    };

    const selectAll = () => {
        if (requestData.order_ids.length === available_orders.length) {
            setRequestData('order_ids', []);
        } else {
            setRequestData('order_ids', available_orders.map(o => o.id));
        }
    };

    const hasBankDetails = bank_details?.account_number;

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <header>
                <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your earnings, update payout details, and request withdrawals.</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Available Earnings */}
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <p className="text-sm text-emerald-700 font-bold uppercase tracking-wider">Available Balance</p>
                        </div>
                        <p className="text-4xl font-bold text-emerald-900 tracking-tight">
                            <span className="text-xl align-top mr-1 font-semibold text-emerald-600">Rp</span>
                            {new Intl.NumberFormat('id-ID').format(available_balance || 0)}
                        </p>
                    </div>
                </div>

                {/* Total Lifetime Earnings */}
                <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>
                            <p className="text-sm text-blue-700 font-bold uppercase tracking-wider">Total Lifetime Earnings</p>
                        </div>
                        <p className="text-4xl font-bold text-blue-900 tracking-tight">
                            <span className="text-xl align-top mr-1 font-semibold text-blue-600">Rp</span>
                            {new Intl.NumberFormat('id-ID').format(stats.total_earnings)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Payout Settings */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Payout Settings</h3>
                    <form onSubmit={handleUpdateSettings} className="space-y-4">
                        <div>
                            <InputLabel value="Bank Name / E-Wallet" />
                            <TextInput
                                className="w-full mt-1"
                                placeholder="e.g. BCA, GoPay, OVO"
                                value={settingsData.bank_name}
                                onChange={e => setSettingsData('bank_name', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Account Number" />
                            <TextInput
                                className="w-full mt-1"
                                placeholder="e.g. 1234567890"
                                value={settingsData.account_number}
                                onChange={e => setSettingsData('account_number', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Account Holder Name" />
                            <TextInput
                                className="w-full mt-1"
                                placeholder="Your full name"
                                value={settingsData.account_holder}
                                onChange={e => setSettingsData('account_holder', e.target.value)}
                                required
                            />
                        </div>
                        <PrimaryButton disabled={settingsProcessing} className="w-full justify-center">
                            Save Details
                        </PrimaryButton>
                    </form>
                </div>

                {/* RIGHT: Request Payout & History */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Request Payout Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-900">Request Withdrawal</h3>
                            {available_orders?.length > 0 && (
                                <button type="button" onClick={selectAll} className="text-sm text-indigo-600 font-bold hover:underline">
                                    {requestData.order_ids.length === available_orders.length ? 'Deselect All' : 'Select All'}
                                </button>
                            )}
                        </div>

                        {!hasBankDetails ? (
                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
                                Please configure your <strong>Payout Settings</strong> (left) before requesting a withdrawal.
                            </div>
                        ) : available_orders?.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                No completed orders available for withdrawal yet.
                            </div>
                        ) : (
                            <form onSubmit={handleRequestPayout}>
                                <div className="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2">
                                    {available_orders.map((order) => (
                                        <div key={order.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${requestData.order_ids.includes(order.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            onClick={() => toggleOrderSelection(order.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={requestData.order_ids.includes(order.id)}
                                                    onChange={() => { }}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{order.order_number}</p>
                                                    <p className="text-xs text-gray-500">Completed: {new Date(order.completed_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-emerald-600 text-sm">
                                                Rp {new Intl.NumberFormat('id-ID').format(order.joki_commission)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center border-t pt-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Selected Amount</p>
                                        <p className="text-2xl font-bold text-indigo-900">
                                            Rp {new Intl.NumberFormat('id-ID').format(
                                                available_orders
                                                    .filter(o => requestData.order_ids.includes(o.id))
                                                    .reduce((sum, o) => sum + o.joki_commission, 0)
                                            )}
                                        </p>
                                    </div>
                                    <PrimaryButton disabled={requestProcessing || requestData.order_ids.length === 0} className="bg-indigo-600 hover:bg-indigo-700">
                                        Submit Request
                                    </PrimaryButton>
                                </div>
                                {requestErrors.order_ids && <p className="text-red-500 text-sm mt-2">{requestErrors.order_ids}</p>}
                            </form>
                        )}
                    </div>

                    {/* History Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Payout History</h3>
                        {payout_history?.length === 0 ? (
                            <p className="text-gray-500 text-sm">No payout history found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-gray-500 border-b">
                                        <tr>
                                            <th className="py-2">Date</th>
                                            <th className="py-2">Amount</th>
                                            <th className="py-2">Status</th>
                                            <th className="py-2">Note</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {payout_history.map((payout) => (
                                            <tr key={payout.id}>
                                                <td className="py-3">{new Date(payout.created_at).toLocaleDateString()}</td>
                                                <td className="py-3 font-bold">Rp {new Intl.NumberFormat('id-ID').format(payout.amount)}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${payout.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                            payout.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                        }`}>
                                                        {payout.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-gray-500 truncate max-w-xs">{payout.admin_note || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
