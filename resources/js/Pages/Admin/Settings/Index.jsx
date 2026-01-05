import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function SettingsIndex({ auth, settings }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        invoice_name: settings.invoice_name || 'Beresin Jasa Digital',
        invoice_address: settings.invoice_address || 'Jalan Digital No. 1\nJakarta, Indonesia',
        whatsapp_number: settings.whatsapp_number || '6281234567890',
        invoice_logo: null,
        qris_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">General Settings</h2>}
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Invoice Configuration</h3>

                            <form onSubmit={submit} className="space-y-6 max-w-xl">

                                <div>
                                    <InputLabel htmlFor="invoice_name" value="Company Name (Invoice Header)" />
                                    <TextInput
                                        id="invoice_name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.invoice_name}
                                        onChange={(e) => setData('invoice_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.invoice_name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="invoice_address" value="Company Address" />
                                    <textarea
                                        id="invoice_address"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="4"
                                        value={data.invoice_address}
                                        onChange={(e) => setData('invoice_address', e.target.value)}
                                        required
                                    ></textarea>
                                    <InputError message={errors.invoice_address} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="whatsapp_number" value="WhatsApp Number" />
                                    <TextInput
                                        id="whatsapp_number"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.whatsapp_number}
                                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.whatsapp_number} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="invoice_logo" value="Invoice Logo (Optional)" />
                                    <input
                                        type="file"
                                        id="invoice_logo"
                                        className="mt-1 block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            hover:file:bg-indigo-100"
                                        onChange={(e) => setData('invoice_logo', e.target.files[0])}
                                        accept="image/*"
                                    />
                                    <InputError message={errors.invoice_logo} className="mt-2" />

                                    {settings.invoice_logo && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500 mb-2">Current Logo:</p>
                                            <img src={`/storage/${settings.invoice_logo}`} alt="Current Logo" className="h-16 object-contain" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="qris_image" value="QRIS Image (Optional)" />
                                    <input
                                        type="file"
                                        id="qris_image"
                                        className="mt-1 block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            hover:file:bg-indigo-100"
                                        onChange={(e) => setData('qris_image', e.target.files[0])}
                                        accept="image/*"
                                    />
                                    <InputError message={errors.qris_image} className="mt-2" />

                                    {settings.qris_image && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500 mb-2">Current QRIS:</p>
                                            <img src={`/storage/${settings.qris_image}`} alt="Current QRIS" className="h-32 object-contain border rounded-lg" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Save Settings</PrimaryButton>

                                    {recentlySuccessful && (
                                        <p className="text-sm text-green-600">Saved.</p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
