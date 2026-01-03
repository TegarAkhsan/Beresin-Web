import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth, packages, selectedPackageId }) {
    const { data, setData, post, processing, errors } = useForm({
        package_id: selectedPackageId || '',
        description: '',
        deadline: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    const selectedPackage = packages.find(p => p.id == data.package_id);

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Order</h2>}
        >
            <Head title="Create Order" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">

                            <div>
                                <InputLabel htmlFor="package_id" value="Select Package" />
                                <select
                                    id="package_id"
                                    name="package_id"
                                    value={data.package_id}
                                    onChange={(e) => setData('package_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">-- Choose a Package --</option>
                                    {packages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.service.name} - {pkg.name} (Rp {new Intl.NumberFormat('id-ID').format(pkg.price)})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.package_id} className="mt-2" />
                            </div>

                            {selectedPackage && (
                                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <h4 className="font-bold text-indigo-700">Package Features:</h4>
                                    <ul className="list-disc list-inside text-sm text-indigo-600 mt-2">
                                        {selectedPackage.features && JSON.parse(selectedPackage.features).map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="description" value="Project Description" />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-32"
                                    placeholder="Describe your requirements in detail..."
                                    required
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="deadline" value="Deadline" />
                                <TextInput
                                    id="deadline"
                                    type="date"
                                    name="deadline"
                                    value={data.deadline}
                                    onChange={(e) => setData('deadline', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.deadline} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="notes" value="Additional Notes (Optional)" />
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                ></textarea>
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Place Order
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
