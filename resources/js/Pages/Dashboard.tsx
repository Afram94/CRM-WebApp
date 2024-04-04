/* // Dashboard.tsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {
    const { dashboardData } = auth;

    return (
        <MainLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="text-gray-900">
                            <h3 className="text-2xl mb-4">Welcome Back, {auth.user.name}!</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-100 rounded p-4 shadow">
                                    <h4 className="text-blue-800 text-lg">Total Customers</h4>
                                    <p className="text-blue-600 text-xl">{dashboardData?.customerCount}</p>
                                </div>
                                <div className="bg-green-100 rounded p-4 shadow">
                                    <h4 className="text-green-800 text-lg">Total Sales</h4>
                                    <p className="text-green-600 text-xl">${dashboardData?.totalSales}</p>
                                </div>
                                <div className="bg-red-100 rounded p-4 shadow">
                                    <h4 className="text-red-800 text-lg">Out of Stock Products</h4>
                                    <p className="text-red-600 text-xl">{dashboardData?.outOfStockCount}</p>
                                </div>
                                <div className="bg-red-100 rounded p-4 shadow">
                                    <h4 className="text-red-800 text-lg">Orders count</h4>
                                    <p className="text-red-600 text-xl">{dashboardData?.orderCount}</p>
                                </div>
                                <div className="bg-red-100 rounded p-4 shadow">
                                    <h4 className="text-red-800 text-lg">Products count</h4>
                                    <p className="text-red-600 text-xl">{dashboardData?.orderCount}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <Link href='/customers' className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    View Customers
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );*/


    import React from 'react';
import { Head } from '@inertiajs/react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps } from '@/types';

import StatCard from '@/Components/StatCard';

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

export default function Dashboard({ auth }: PageProps) {
    const { dashboardData } = auth;

    // Convert monthly sales data for the Line chart
    const lineChartData = {
        labels: dashboardData?.monthlySalesData.map(data => `${data.month}-${data.year}`),
        datasets: [{
            label: 'Monthly Sales',
            data: dashboardData?.monthlySalesData.map(data => data.totalSales),
            fill: false,
            borderColor: '#60A5FA',
            tension: 0.1,
        }],
    };

    // Convert product counts by category for the Bar chart
    const barChartData = {
        labels: dashboardData?.productCountsByCategory.map(cat => cat.name),
        datasets: [{
            label: 'Products by Category',
            data: dashboardData?.productCountsByCategory.map(cat => cat.productCount),
            backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
        }],
    };

    // Orders by Status for the Doughnut chart
    const doughnutChartData = {
        labels: Object.keys(dashboardData?.ordersByStatus),
        datasets: [{
            data: Object.values(dashboardData?.ordersByStatus),
            backgroundColor: ['#60A5FA', '#EF4444', '#F59E0B', '#10B981'],
            borderColor: ['#3B82F6', '#B91C1C', '#D97706', '#047857'],
            borderWidth: 1,
        }],
    };
    const doughnutChartOptions = {
        plugins: { legend: { position: 'top' } },
        maintainAspectRatio: false,
    };

    return (
        <MainLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="py-12 min-h-screen">
                <div className="mx-auto px-4 sm:px-6 lg:px-8"> {/* max-w-6xl */}
                    <div className="mb-8">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 shadow bg-slate-50 rounded-lg p-4">
                        
                                    <StatCard
                                        title="Total Customers"
                                        value={dashboardData?.customerCount}
                                        bgColor="bg-blue-100"
                                        textColor="text-blue-800"
                                        valueColor="text-blue-600"
                                    />
                                    <StatCard
                                        title="Total Sales"
                                        value={`$${dashboardData?.totalSales}`}
                                        bgColor="bg-green-100"
                                        textColor="text-green-800"
                                        valueColor="text-green-600"
                                    />
                                    <StatCard
                                        title="Out of Stock Products"
                                        value={dashboardData?.outOfStockCount}
                                        bgColor="bg-red-100"
                                        textColor="text-red-800"
                                        valueColor="text-red-600"
                                    />
                                    <StatCard
                                        title="Orders Count"
                                        value={dashboardData?.orderCount}
                                        bgColor="bg-red-100"
                                        textColor="text-red-800"
                                        valueColor="text-red-600"
                                    />
                                    <StatCard
                                        title="Products Count"
                                        value={dashboardData?.orderCount} // Assuming this should be productCount or similar
                                        bgColor="bg-red-100"
                                        textColor="text-red-800"
                                        valueColor="text-red-600"
                                    />
                                </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        {/* Chart sections */}
                        <div className="p-6 rounded-lg shadow bg-slate-50">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-500 bg-slate-200 rounded-lg p-2 flex justify-center">Sales Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="aspect-w-16 aspect-h-9 shadow-xl border-2 p-5 rounded-lg bg-slate-50">
                                    <Line data={lineChartData} />
                                </div>
                                <div className="aspect-w-16 aspect-h-9 shadow-xl border-2 p-5 rounded-lg bg-slate-50">
                                    <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 rounded-lg shadow bg-slate-50">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-500 bg-slate-200 rounded-lg p-2 flex justify-center">Product Analysis</h3>
                            <div className="aspect-w-16 aspect-h-9 shadow-xl border-2 p-5 rounded-lg bg-slate-50">
                                <Bar data={barChartData} />
                            </div>
                        </div>
                    </div>
                </div>
            
        </MainLayout>
    );
}
