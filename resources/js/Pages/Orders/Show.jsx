import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ auth, order }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null,
        result_file: null,
        status: order.status,
    });

    const uploadPayment = (e) => {
        e.preventDefault();
        post(route('orders.update', order.id));
    };

    const uploadResult = (e) => {
        e.preventDefault();
        post(route('orders.update', order.id));
    };

    const updateStatus = (newStatus) => {
        setData('status', newStatus);
        // Trigger post immediately or utilize useEffect
        // For simplicity, using a dedicated form submission or similar
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Order #{order.order_number}</h2>}
        >
            <Head title={`Order #${order.order_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {/* Status Bar */}
                        <div className="mb-8 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`text-lg font-bold uppercase ${order.status === 'completed' ? 'text-green-600' : 'text-indigo-600'}`}>
                                    {order.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Amount</p>
                                <p className="text-xl font-bold">Rp {new Intl.NumberFormat('id-ID').format(order.amount)}</p>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-lg font-bold mb-4">Project Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Service</p>
                                        <p className="font-medium">{order.package.service.name} - {order.package.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Description</p>
                                        <p className="text-gray-700 whitespace-pre-wrap">{order.description}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Deadline</p>
                                        <p className="font-medium text-red-500">{order.deadline}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-4">Actions</h3>

                                {/* Customer Actions */}
                                {auth.user.role === 'customer' && (
                                    <div className="space-y-6">
                                        {order.status === 'pending_payment' && (
                                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                                <h4 className="font-bold text-yellow-800 mb-2">Payment Required</h4>
                                                <p className="text-sm text-yellow-700 mb-4">Please transfer to BCA 1234567890 (Beresin) and upload proof.</p>
                                                <form onSubmit={uploadPayment}>
                                                    <input
                                                        type="file"
                                                        onChange={e => setData('payment_proof', e.target.files[0])}
                                                        className="block w-full text-sm text-slate-500 mb-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                    />
                                                    <PrimaryButton disabled={processing}>Upload Proof</PrimaryButton>
                                                </form>
                                            </div>
                                        )}

                                        {order.result_file && (
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <h4 className="font-bold text-green-800 mb-2">Result Ready!</h4>
                                                <a href={`/storage/${order.result_file}`} target="_blank" className="text-indigo-600 underline font-bold">
                                                    Download Result
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Joki Actions */}
                                {auth.user.role === 'joki' && (
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h4 className="font-bold text-blue-800 mb-2">Workspace</h4>

                                            <div className="mb-4">
                                                <p className="text-sm text-blue-700 mb-1">Update Status:</p>
                                                {/* Status buttons or select would go here */}
                                            </div>

                                            <form onSubmit={uploadResult}>
                                                <label className="block text-sm font-medium text-blue-900 mb-2">Upload Result File</label>
                                                <input
                                                    type="file"
                                                    onChange={e => setData('result_file', e.target.files[0])}
                                                    className="block w-full text-sm text-slate-500 mb-2"
                                                />
                                                <PrimaryButton disabled={processing}>Submit Result</PrimaryButton>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
