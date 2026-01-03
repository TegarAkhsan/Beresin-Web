import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PackageModal from './Partials/PackageModal';

export default function Index({ auth, services }) {
    const [showPackageModal, setShowPackageModal] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [editingPackage, setEditingPackage] = useState(null);

    const openCreatePackage = (serviceId) => {
        setSelectedServiceId(serviceId);
        setEditingPackage(null);
        setShowPackageModal(true);
    };

    const openEditPackage = (pkg, serviceId) => {
        setSelectedServiceId(serviceId);
        setEditingPackage(pkg);
        setShowPackageModal(true);
    };

    const closePackageModal = () => {
        setShowPackageModal(false);
        setEditingPackage(null);
        setSelectedServiceId(null);
        // Refresh page to show new data
        router.reload();
    };

    const formatFeatures = (features) => {
        if (!features) return [];
        let items = [];
        if (Array.isArray(features)) {
            items = features;
        } else {
            try {
                const parsed = JSON.parse(features);
                if (Array.isArray(parsed)) items = parsed;
                else items = [features];
            } catch (e) {
                // Split by newline if it looks like a string list, or just single line
                items = features.toString().split('\n');
            }
        }
        return items;
    };


    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manage Services & Packages</h2>}
        >
            <Head title="Manage Services" />

            <div className="grid gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{service.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                                </div>
                                <button className="text-sm text-indigo-600 font-medium hover:underline">Edit Service</button>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Packages</h4>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {service.packages.map((pkg) => (
                                        <div key={pkg.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 transition-colors flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-semibold text-gray-900">{pkg.name}</div>
                                                    <div className="text-sm font-bold text-green-600">
                                                        Rp {new Intl.NumberFormat('id-ID').format(pkg.price)}
                                                    </div>
                                                </div>
                                                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside mb-4">
                                                    {/* Clean Display of Features */}
                                                    {formatFeatures(pkg.features).slice(0, 5).map((f, i) => (
                                                        <li key={i}>{f.replace(/["\[\]]/g, '')}</li>
                                                    ))}
                                                    {formatFeatures(pkg.features).length > 5 && <li>...</li>}
                                                </ul>
                                            </div>
                                            <div className="mt-auto text-right border-t border-gray-50 pt-2">
                                                <button
                                                    onClick={() => openEditPackage(pkg, service.id)}
                                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                                >
                                                    Edit Package
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Package Card */}
                                    <button
                                        onClick={() => openCreatePackage(service.id)}
                                        className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors h-full min-h-[140px]"
                                    >
                                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                        <span className="text-sm font-medium">Add Package</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Service Card (Placeholder) */}
                <button className="bg-gray-50 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span className="text-lg font-medium">Add New Service Category</span>
                </button>
            </div>

            <PackageModal
                show={showPackageModal}
                onClose={closePackageModal}
                serviceId={selectedServiceId}
                packageToEdit={editingPackage}
            />
        </AdminLayout>
    );
}
