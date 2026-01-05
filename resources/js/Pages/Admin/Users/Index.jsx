import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, users, filters }) {
    const [blacklistUser, setBlacklistUser] = useState(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        is_blacklisted: false,
        blacklist_reason: '',
    });

    // Search State
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('admin.users.index'), { search: searchQuery }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const openBlacklistModal = (user) => {
        setBlacklistUser(user);
        setData({
            is_blacklisted: !user.is_blacklisted,
            blacklist_reason: user.blacklist_reason || '',
        });
    };

    const handleBlacklistSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.blacklist', blacklistUser.id), {
            onSuccess: () => {
                setBlacklistUser(null);
                reset();
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">User Management</h2>}
        >
            <Head title="Manage Users" />

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <Link
                            href={route('admin.users.create')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                        >
                            Add New User
                        </Link>

                        <div className="flex items-center gap-2">
                            <TextInput
                                className="w-64 text-sm"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Joined</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {user.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${user.role === 'admin' ? 'bg-red-100 text-red-800' : ''}
                                                ${user.role === 'joki' ? 'bg-indigo-100 text-indigo-800' : ''}
                                                ${user.role === 'customer' ? 'bg-green-100 text-green-800' : ''}
                                            `}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_blacklisted ? (
                                                <span className="bg-red-900 text-red-100 text-xs font-bold px-2 py-0.5 rounded border border-red-700 uppercase">
                                                    BLACKLISTED
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded border border-green-200">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => openBlacklistModal(user)}
                                                className={`font-medium hover:underline ${user.is_blacklisted ? 'text-green-600' : 'text-slate-900'}`}
                                            >
                                                {user.is_blacklisted ? 'Restore' : 'Blacklist'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-center">
                        {users.links.map((link, index) => {
                            const Label = link.url ? Link : 'span';
                            return (
                                <Label
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 mx-1 rounded border text-sm
                                        ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}
                                        ${!link.url ? 'opacity-50 cursor-not-allowed text-gray-400' : 'hover:bg-gray-50'}
                                    `}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <Modal show={!!blacklistUser} onClose={() => setBlacklistUser(null)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {data.is_blacklisted ? 'Blacklist User' : 'Restore User'}
                    </h2>

                    <p className="mb-4 text-sm text-gray-600">
                        {data.is_blacklisted
                            ? `Are you sure you want to blacklist ${blacklistUser?.name}? They will be logged out and unable to access the platform.`
                            : `Are you sure you want to restore access for ${blacklistUser?.name}?`}
                    </p>

                    <form onSubmit={handleBlacklistSubmit}>
                        {data.is_blacklisted && (
                            <div className="mb-6">
                                <InputLabel value="Reason for Blacklist" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={data.blacklist_reason}
                                    onChange={e => setData('blacklist_reason', e.target.value)}
                                    placeholder="e.g. Violation of Terms, Fraud..."
                                />
                                {errors.blacklist_reason && <div className="text-red-500 text-sm mt-1">{errors.blacklist_reason}</div>}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <SecondaryButton onClick={() => setBlacklistUser(null)}>Cancel</SecondaryButton>
                            <PrimaryButton className={data.is_blacklisted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} disabled={processing}>
                                {data.is_blacklisted ? 'Confirm Blacklist' : 'Restore Access'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
