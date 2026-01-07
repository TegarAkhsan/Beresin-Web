import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react'; // Added Link here
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Index({ auth, orders, services, filters }) {
    const [queryParams, setQueryParams] = useState({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        service_id: filters.service_id || '',
    });

    const handleFilterChange = (key, value) => {
        setQueryParams(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get(route('admin.transactions.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setQueryParams({ start_date: '', end_date: '', service_id: '' });
        router.get(route('admin.transactions.index'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Transaction Reports</h2>}
        >
            <Head title="Transactions" />

            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 text-gray-900 dark:text-gray-100 flex flex-col lg:flex-row gap-4 lg:items-end">
                    <div className="w-full lg:w-auto">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                        <TextInput
                            type="date"
                            className="block w-full"
                            value={queryParams.start_date}
                            onChange={e => handleFilterChange('start_date', e.target.value)}
                        />
                    </div>
                    <div className="w-full lg:w-auto">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                        <TextInput
                            type="date"
                            className="block w-full"
                            value={queryParams.end_date}
                            onChange={e => handleFilterChange('end_date', e.target.value)}
                        />
                    </div>
                    <div className="w-full lg:w-auto min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service</label>
                        <select
                            className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full"
                            value={queryParams.service_id}
                            onChange={e => handleFilterChange('service_id', e.target.value)}
                        >
                            <option value="">All Services</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2 mt-2 lg:mt-0">
                        <button
                            onClick={applyFilters}
                            className="flex-1 lg:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
                        >
                            Filter
                        </button>
                        <button
                            onClick={resetFilters}
                            className="flex-1 lg:flex-none px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium transition"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100">

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {orders.data.length === 0 ? (
                            <div className="text-center py-6 text-gray-500 italic">No transactions found matching your criteria.</div>
                        ) : (
                            orders.data.map((order) => (
                                <div key={order.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-mono font-bold text-gray-900">{order.invoice_number || '-'}</h4>
                                            <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <p className="font-bold text-gray-900">
                                            Rp {new Intl.NumberFormat('id-ID').format(order.amount)}
                                        </p>
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-sm font-medium text-indigo-700">{order.package?.service?.name}</p>
                                        <p className="text-xs text-gray-500">{order.package?.name}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-900">{order.user.name}</p>
                                            <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold uppercase">
                                                LUNAS
                                            </span>
                                        </div>
                                        <a
                                            href={route('orders.invoice', order.id)}
                                            target="_blank"
                                            className="px-3 py-1.5 bg-gray-800 text-white rounded text-xs font-bold uppercase tracking-wider"
                                        >
                                            PDF
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Invoice</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Service</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.data.map((order) => (
                                    <tr key={order.id} className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-gray-100">
                                            {order.invoice_number || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{order.user.name}</div>
                                            <div className="text-xs text-gray-500">{order.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.package?.service?.name}
                                            <div className="text-xs text-gray-500">{order.package?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">
                                            Rp {new Intl.NumberFormat('id-ID').format(order.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full font-semibold bg-green-100 text-green-800">
                                                SUDAH LUNAS
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={route('orders.invoice', order.id)}
                                                target="_blank"
                                                className="inline-flex items-center px-3 py-1.5 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                            >
                                                PDF Invoice
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                {orders.data.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No transactions found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
