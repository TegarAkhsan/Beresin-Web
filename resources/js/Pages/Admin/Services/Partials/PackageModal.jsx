import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PackageModal({ show, onClose, serviceId, packageToEdit }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        price: '',
        description: '',
        features: '', // Will be handled as multiline string
    });

    useEffect(() => {
        if (packageToEdit) {
            setData({
                name: packageToEdit.name,
                price: packageToEdit.price,
                description: packageToEdit.description || '',
                features: formatFeatures(packageToEdit.features),
            });
        } else {
            reset();
        }
    }, [packageToEdit, show]);

    const formatFeatures = (features) => {
        if (!features) return '';
        if (Array.isArray(features)) return features.join('\n');
        try {
            const parsed = JSON.parse(features);
            if (Array.isArray(parsed)) return parsed.join('\n');
            return features; // Fallback
        } catch (e) {
            return features; // Plain string
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Convert newlines back to array (or just keep as text if backend handles it)
        // For now, let's assume we send it as a string and backend or this modal prepares it. 
        // Actually best to send as is and let controller parse valid JSON or store as text.
        // But user said "no symbols", so imply text area input.

        if (packageToEdit) {
            put(route('admin.packages.update', packageToEdit.id), {
                onSuccess: onClose,
            });
        } else {
            // Need to append service_id manually since it's not in the form data hook initial state if we want it clean
            // Alternatively use transform in useForm, but post supports data arg.
            // Wait, useForm post sends 'data' state.
            // Let's add service_id to route query or body.
            // Better: route('admin.services.packages.store', serviceId)
            post(route('admin.services.packages.store', serviceId), {
                onSuccess: onClose,
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {packageToEdit ? 'Edit Package' : 'Add New Package'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Package Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="e.g. Basic Plan"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="price" value="Price (Rp)" />
                        <TextInput
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="e.g. 50000"
                            required
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="2"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        ></textarea>
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="features" value="Features (One per line)" />
                        <textarea
                            id="features"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="5"
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            value={data.features}
                            onChange={(e) => setData('features', e.target.value)}
                        ></textarea>
                        <InputError message={errors.features} className="mt-2" />
                        <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line. They will be displayed as a list.</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {packageToEdit ? 'Save Changes' : 'Create Package'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
