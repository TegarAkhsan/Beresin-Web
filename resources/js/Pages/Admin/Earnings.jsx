import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Earnings({ auth, totalEarnings = 0, totalWithdrawn = 0, availableBalance = 0, history = [], bank_details = {} }) {
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

    // Withdraw Form
    const { data: withdrawData, setData: setWithdrawData, post: postWithdraw, processing: withdrawProcessing, reset: resetWithdraw, errors: withdrawErrors } = useForm({
        amount: '',
        notes: ''
    });

    // Validated Bank Details (for withdraw check)
    const hasBankDetails = bank_details?.bank_name && bank_details?.account_number && bank_details?.account_holder;

    // Settings Form
    const { data: settingsData, setData: setSettingsData, post: postSettings, processing: settingsProcessing, recentlySuccessful: settingsSuccess } = useForm({
        bank_name: bank_details?.bank_name || '',
        account_number: bank_details?.account_number || '',
        account_holder: bank_details?.account_holder || '',
    });

    const handleWithdraw = (e) => {
        e.preventDefault();
        postWithdraw(route('admin.earnings.withdraw'), {
            onSuccess: () => {
                setWithdrawModalOpen(false);
                resetWithdraw();
            }
        });
    };

    const handleUpdateSettings = (e) => {
        e.preventDefault();
        postSettings(route('admin.earnings.settings'));
    };

    return (
        <AdminLayout
            user={auth.user}
            header="My Earnings"
        >
            <Head title="Admin Earnings" />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                {/* 1. FINANCIAL SUMMARY */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Total Lifetime Earnings */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <h2 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Total Lifetime Earnings</h2>
                                <div className="text-4xl font-bold text-gray-900 mb-1">
                                    <span className="text-xl opacity-60 align-top mr-1">Rp</span>
                                    {new Intl.NumberFormat('id-ID').format(totalEarnings)}
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
                                Accumulated commission (20%)
                            </div>
                        </div>

                        {/* Available Balance (Active) */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative flex flex-col justify-between">
                            <div className="relative z-10">
                                <h2 className="text-indigo-100 font-medium uppercase tracking-wider text-sm mb-2">Available Balance</h2>
                                <div className="text-5xl font-bold mb-1">
                                    <span className="text-2xl opacity-80 align-top mr-1">Rp</span>
                                    {new Intl.NumberFormat('id-ID').format(availableBalance)}
                                </div>
                                <p className="text-indigo-200 text-sm mt-1">Ready to withdraw</p>
                            </div>

                            <div className="relative z-10 mt-6">
                                <button
                                    onClick={() => setWithdrawModalOpen(true)}
                                    disabled={!hasBankDetails}
                                    className={`w-full py-3 rounded-xl font-bold shadow-sm transition flex items-center justify-center ${hasBankDetails
                                        ? 'bg-white text-indigo-700 hover:bg-indigo-50'
                                        : 'bg-white/20 text-white/50 cursor-not-allowed'
                                        }`}
                                >
                                    {hasBankDetails ? 'Withdraw Funds' : 'Set Bank Details First'}
                                </button>
                            </div>
                            {/* Decorative Patterns */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>

                {/* 2. PAYOUT SETTINGS */}
                <div className="xl:col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Payout Settings</h3>
                    <form onSubmit={handleUpdateSettings} className="space-y-4">
                        <div>
                            <InputLabel value="Bank Name" />
                            <TextInput
                                className="w-full mt-1"
                                value={settingsData.bank_name}
                                onChange={(e) => setSettingsData('bank_name', e.target.value)}
                                placeholder="e.g. BCA, Mandiri"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Account Number" />
                            <TextInput
                                className="w-full mt-1"
                                value={settingsData.account_number}
                                onChange={(e) => setSettingsData('account_number', e.target.value)}
                                placeholder="e.g. 1234567890"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Account Holder Name" />
                            <TextInput
                                className="w-full mt-1"
                                value={settingsData.account_holder}
                                onChange={(e) => setSettingsData('account_holder', e.target.value)}
                                placeholder="Name on bank account"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <PrimaryButton className="w-full justify-center" disabled={settingsProcessing}>
                                {settingsProcessing ? 'Saving...' : 'Save Settings'}
                            </PrimaryButton>
                            {settingsSuccess && <p className="text-emerald-600 text-xs text-center mt-2 font-medium">Settings saved successfully.</p>}
                        </div>
                    </form>
                </div>
            </div>

            {/* 3. HISTORY TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                    <span className="px-3 py-1 bg-gray-50 text-xs font-semibold text-gray-500 rounded-full">
                        {history.length} Transactions
                    </span>
                </div>

                {/* Mobile Transaction Cards */}
                <div className="lg:hidden">
                    {history.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">No transactions yet.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {history.map((item) => (
                                <div key={item.id} className="p-4 bg-white hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs text-gray-500">{item.date}</p>
                                            <h4 className="font-bold text-gray-900 mt-1">{item.order_number}</h4>
                                        </div>
                                        {item.type === 'income' ? (
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase">
                                                INCOME
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-100 font-bold uppercase">
                                                WITHDRAWAL
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <p className="text-sm text-gray-500 italic max-w-[60%] truncate">{item.source}</p>
                                        <p className={`text-right font-bold text-lg ${item.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {item.type === 'income' ? '+' : ''} Rp {new Intl.NumberFormat('id-ID').format(item.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Reference</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {history.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No transactions yet.</td></tr>
                            ) : (
                                history.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 text-gray-600">{item.date}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.order_number}</td>
                                        <td className="px-6 py-4">
                                            {item.type === 'income' ? (
                                                <span className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">
                                                    INCOME
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700 border border-amber-100 font-bold">
                                                    WITHDRAWAL
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate" title={item.source}>{item.source}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {item.type === 'income' ? '+' : ''} Rp {new Intl.NumberFormat('id-ID').format(item.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* WITHDRAW MODAL */}
            <Modal show={withdrawModalOpen} onClose={() => setWithdrawModalOpen(false)}>
                <form onSubmit={handleWithdraw} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Withdraw Funds</h2>

                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Transfer Destination</p>
                        <p className="font-bold text-gray-900 text-lg">{settingsData.bank_name}</p>
                        <p className="text-gray-600">{settingsData.account_number}</p>
                        <p className="text-gray-500 text-sm mt-1">{settingsData.account_holder}</p>
                        <p className="text-xs text-indigo-400 mt-2 italic">Ensure these details are correct in 'Payout Settings' before withdrawing.</p>
                    </div>

                    <div className="mb-4">
                        <InputLabel value="Amount (Rp)" />
                        <TextInput
                            type="number"
                            className="w-full mt-1"
                            value={withdrawData.amount}
                            onChange={(e) => setWithdrawData('amount', e.target.value)}
                            placeholder="Min 10.000"
                            required
                        />
                        {withdrawErrors.amount && <div className="text-red-500 text-xs mt-1">{withdrawErrors.amount}</div>}
                    </div>

                    <div className="mb-4">
                        <InputLabel value="Notes (Optional)" />
                        <TextInput
                            className="w-full mt-1"
                            value={withdrawData.notes}
                            onChange={(e) => setWithdrawData('notes', e.target.value)}
                            placeholder="e.g. Monthly salary"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <SecondaryButton onClick={() => setWithdrawModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={withdrawProcessing}>Confirm Withdraw</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
