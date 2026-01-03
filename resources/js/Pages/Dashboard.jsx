import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import CustomerDashboard from './Dashboards/CustomerDashboard';
import JokiDashboard from './Dashboards/JokiDashboard';

export default function Dashboard({ orders, stats }) {
    const user = usePage().props.auth.user;

    if (user.role === 'customer') {
        return (
            <>
                <Head title="Dashboard" />
                <CustomerDashboard auth={{ user }} orders={orders} stats={stats} />
            </>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {user.role === 'joki' && <JokiDashboard auth={{ user }} orders={orders} stats={stats} />}

            {/* Fallback or other roles */}
            {!['customer', 'joki', 'admin'].includes(user.role) && (
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                You're logged in as {user.role}!
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
