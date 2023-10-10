// Dashboard.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import CustomersList from '@/Pages/Customers/CustomersList';  // Import the component
import MainLayout from '@/Layouts/MainLayout';

export default function Dashboard({ auth }: PageProps) {
    return (
        <MainLayout>
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
            >
                <Head title="Dashboard" />
                <Link href='/customers'>Click</Link>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">You're logged in!</div>
                            
                            {/* Use the CustomersList component */}
                            {/* <CustomersList customers={auth.customers} /> */}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </MainLayout>
    );
}
