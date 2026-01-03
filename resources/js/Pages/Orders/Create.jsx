import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';


export default function Create({ auth, packages, selectedPackageId }) {
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        package_id: selectedPackageId || '',
        // Bio Data
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'L',
        address: user.address || '',
        university: user.university || '', // Asal Instansi
        referral_source: user.referral_source || '',

        // Order Data
        description: '', // Catatan Pesanan
        deadline: '',
        notes: '',
        external_link: '',
        reference_file: null,
        previous_project_file: null,

        // Payment Method (Visual only for now, passed to backend if needed)
        payment_method: 'qris',
    });

    const [selectedPackage, setSelectedPackage] = useState(
        packages.find(p => p.id == selectedPackageId) || null
    );

    const [rushFee, setRushFee] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Initial Defaults
    useEffect(() => {
        const pkg = packages.find(p => p.id == data.package_id);
        setSelectedPackage(pkg);

        // Auto-set default deadline if package selected and deadline empty
        if (pkg && !data.deadline) {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + (pkg.duration_days || 3));
            setData('deadline', defaultDate.toISOString().split('T')[0]);
        }
    }, [data.package_id]);

    // Fee Calculation
    useEffect(() => {
        if (!selectedPackage || !data.deadline) {
            setRushFee(0);
            setTotalPrice(selectedPackage ? selectedPackage.price + 5000 : 0);
            return;
        }

        const standardDeadline = new Date();
        standardDeadline.setDate(standardDeadline.getDate() + (selectedPackage.duration_days || 3));
        standardDeadline.setHours(0, 0, 0, 0);

        const userDeadline = new Date(data.deadline);
        userDeadline.setHours(0, 0, 0, 0);

        const diffTime = standardDeadline - userDeadline;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

        let fee = 0;
        if (diffDays > 0) {
            fee = diffDays * 25000;
        }

        setRushFee(fee);
        setTotalPrice(selectedPackage.price + fee + 5000); // Base + Rush + Op Fee

    }, [data.deadline, selectedPackage]);


    const submit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    // Helper for duration text
    const formatDuration = (days) => {
        if (!days) return '3 Days'; // Default if days is null/undefined
        if (days <= 3) return '1-3 Days';
        if (days <= 7) return '6-7 Days';
        return '10-15 Days';
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Checkout Order</h2>}>
            <Head title="Checkout" />

            <div className="py-12 bg-gray-50 from-gray-50 to-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="grid md:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: FORM DATA */}
                        <div className="md:col-span-2 space-y-8">

                            {/* 1. Biodata Section */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="name" value="Full Name" />
                                        <TextInput id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="email" value="Email" />
                                        <TextInput id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="mt-1 block w-full bg-gray-50" readOnly />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="phone" value="WhatsApp Number" />
                                        <TextInput id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} className="mt-1 block w-full" placeholder="08..." required />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="gender" value="Gender" />
                                        <select id="gender" value={data.gender} onChange={e => setData('gender', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                                            <option value="L">Male (Laki-laki)</option>
                                            <option value="P">Female (Perempuan)</option>
                                        </select>
                                        <InputError message={errors.gender} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="address" value="Full Address" />
                                        <TextInput id="address" value={data.address} onChange={e => setData('address', e.target.value)} className="mt-1 block w-full" placeholder="Street, City, Province" required />
                                        <InputError message={errors.address} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="university" value="Institution / University" />
                                        <TextInput id="university" value={data.university} onChange={e => setData('university', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.university} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="referral_source" value="Source (Know us from?)" />
                                        <select id="referral_source" value={data.referral_source} onChange={e => setData('referral_source', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" required>
                                            <option value="">-- Select Source --</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="google">Google Search</option>
                                            <option value="friend">Friend / Recommendation</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <InputError message={errors.referral_source} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Order Details Section */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                    Project Requirements
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="description" value="Project Note / Description" />
                                        <textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-24" placeholder="Explain your project details..." ></textarea>
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="deadline" value="Desired Deadline" />
                                        <TextInput id="deadline" type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} className="mt-1 block w-full" required />
                                        {rushFee > 0 && <p className="text-xs text-amber-600 font-bold mt-1">⚡ RUSH ORDER: +Rp 25.000/day earlier</p>}
                                        <p className="text-xs text-gray-400 mt-1">Initial Recommendation: {selectedPackage?.duration_days || 3} days from now ({formatDuration(selectedPackage?.duration_days)})</p>
                                        <InputError message={errors.deadline} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="external_link" value="External Link (Google Drive / Figma / Etc)" />
                                        <TextInput id="external_link" type="url" value={data.external_link} onChange={e => setData('external_link', e.target.value)} className="mt-1 block w-full" placeholder="https://..." />
                                        <InputError message={errors.external_link} className="mt-2" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="reference_file" value="Reference Brief" />
                                            <input type="file" onChange={e => setData('reference_file', e.target.files[0])} accept="application/pdf" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                            <p className="text-xs text-gray-400 mt-1">PDF Only, Max 10MB.</p>
                                            <InputError message={errors.reference_file} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="previous_project_file" value="Previous Project / Assets" />
                                            <input type="file" onChange={e => setData('previous_project_file', e.target.files[0])} accept="application/pdf" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                            <p className="text-xs text-gray-400 mt-1">PDF Only, Max 10MB.</p>
                                            <InputError message={errors.previous_project_file} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: SUMMARY */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 sticky top-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                                <div className="mb-6">
                                    <InputLabel htmlFor="package_id" value="Selected Package" className="mb-2" />
                                    <select id="package_id" value={data.package_id} onChange={e => setData('package_id', e.target.value)} className="w-full text-sm border-gray-300 rounded-lg">
                                        {packages.map(pkg => (
                                            <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.service.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedPackage && (
                                    <div className="space-y-4 mb-8 border-b border-gray-100 pb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Service</span>
                                            <span className="font-medium">{selectedPackage.service.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Est. Time</span>
                                            <span className="font-medium">
                                                {rushFee > 0 ? (
                                                    <span className="text-indigo-600 font-bold">
                                                        <span className="line-through text-gray-400 mr-2">{formatDuration(selectedPackage.duration_days)}</span>
                                                        {Math.max(1, selectedPackage.duration_days - (rushFee / 25000))} Days
                                                    </span>
                                                ) : (
                                                    <span>{formatDuration(selectedPackage.duration_days)}</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Base Price</span>
                                            <span className="font-medium">Rp {new Intl.NumberFormat('id-ID').format(selectedPackage.price)}</span>
                                        </div>
                                        {rushFee > 0 && (
                                            <div className="flex justify-between items-center text-sm text-amber-600 font-bold bg-amber-50 p-2 rounded">
                                                <span>Rush Fee</span>
                                                <span>+ Rp {new Intl.NumberFormat('id-ID').format(rushFee)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-sm text-slate-500">
                                            <span>Operational Fee</span>
                                            <span>+ Rp 5.000</span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg font-bold text-indigo-900 mt-4 pt-4 border-t border-gray-100">
                                            <span>Total</span>
                                            <span>Rp {new Intl.NumberFormat('id-ID').format(totalPrice)}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-8">
                                    <InputLabel value="Payment Method" className="mb-3" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div
                                            onClick={() => setData('payment_method', 'qris')}
                                            className={`cursor-pointer p-3 rounded-lg border text-center transition-all ${data.payment_method === 'qris' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}
                                        >
                                            QRIS
                                        </div>
                                        <div
                                            onClick={() => setData('payment_method', 'va')}
                                            className={`cursor-pointer p-3 rounded-lg border text-center transition-all ${data.payment_method === 'va' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}
                                        >
                                            Transfer / VA
                                        </div>
                                    </div>
                                </div>

                                <PrimaryButton className="w-full justify-center py-3 text-base shadow-indigo-200 shadow-xl" disabled={processing}>
                                    Pay & Secure Slot 🔒
                                </PrimaryButton>

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    By clicking Pay, you agree to our Terms of Service.
                                </p>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
