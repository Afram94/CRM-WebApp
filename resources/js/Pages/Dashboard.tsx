// Dashboard.tsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {

    console.log(auth)
    return (
        <MainLayout title="Dashboard">
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
            >
                <Head title="Dashboard" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900">
                                <h3 className="text-2xl mb-4">Welcome Back, {auth.user.name}!</h3>

                                {/* Cards for Dashboard Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-100 rounded p-4 shadow">
                                        <h4 className="text-blue-800 text-lg">Total Customers</h4>
                                        <p className="text-blue-600 text-xl">150</p>
                                    </div>
                                    <div className="bg-green-100 rounded p-4 shadow">
                                        <h4 className="text-green-800 text-lg">Monthly Sales</h4>
                                        <p className="text-green-600 text-xl">$4,200</p>
                                    </div>
                                    <div className="bg-red-100 rounded p-4 shadow">
                                        <h4 className="text-red-800 text-lg">Pending Orders</h4>
                                        <p className="text-red-600 text-xl">35</p>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <div className="border-t pt-4">
                                    <Link href='/customers' className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        View Customers
                                    </Link>
                                    {/* Additional links can be added here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </MainLayout>
    );
}
