import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, user }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit User: {user.name}</h2>}
        >
            <Head title={`Edit ${user.name}`} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <form onSubmit={submit} className="max-w-xl">
                            {/* Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email */}
                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Role */}
                            <div className="mt-4">
                                <InputLabel htmlFor="role" value="Role" />
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="customer">Customer</option>
                                    <option value="joki">Joki</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            {/* Specialization (Only for Joki) */}
                            {data.role === 'joki' && (
                                <div className="mt-4">
                                    <InputLabel htmlFor="specialization" value="Specialization" />
                                    <select
                                        id="specialization"
                                        name="specialization"
                                        value={data.specialization}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('specialization', e.target.value)}
                                    >
                                        <option value="">-- Select Specialization --</option>
                                        <option value="web">Web Development</option>
                                        <option value="ui/ux">UI/UX Design</option>
                                        <option value="mobile">Mobile Development</option>
                                    </select>
                                    <InputError message={errors.specialization} className="mt-2" />
                                </div>
                            )}

                            {/* Password (Optional) */}
                            <div className="mt-4 border-t pt-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Change Password (Optional)</h3>
                                <div>
                                    <InputLabel htmlFor="password" value="New Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-6">
                                <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                                <Link
                                    href={route('admin.users.index')}
                                    className="text-gray-600 hover:text-gray-900 text-sm underline"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
