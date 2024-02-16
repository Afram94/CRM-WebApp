// resources/js/components/SuperAdminDashboard.tsx

import React from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { PageProps, SuperAdminUsers, User } from '@/types'; // Assuming your types are exported and can be imported

const SuperAdminDashboard: React.FC<PageProps> = ({ auth }) => {
    const { superadminusers } = auth;

    console.log(superadminusers);

    // Separate the users into admins, their children, and the super admin
    const admins = superadminusers.filter(user => user.user_id === null && user.email !== "afram.h@hotmail.com");
    const superAdmin = superadminusers.find(user => user.email === "afram.h@hotmail.com");

    // Map children to their respective admins
    admins.forEach(admin => {
        admin.children = superadminusers.filter(user => user.user_id === admin.id);
    });

    return (
        <SuperAdminLayout>
            <div className="p-8">
                <h1 className="text-2xl font-semibold mb-6">Super Admin Dashboard</h1>
                
                {superadminusers.filter(user => user.user_id === null).map((admin: SuperAdminUsers, index: number) => {
                    // Calculate total records (customers + products) for admin and their children
                    const totalRecordsForAdmin = (admin.customers_count ?? 0) + (admin.products_count ?? 0);
                    const totalRecordsForChildren = admin.children?.reduce((acc, child) => acc + ((child as SuperAdminUsers).customers_count ?? 0) + ((child as SuperAdminUsers).products_count ?? 0), 0) ?? 0;


                    const totalRecords = totalRecordsForAdmin + totalRecordsForChildren;

                    return (
                        <div key={admin.id} className="mb-8">
                            <h2 className="text-xl font-semibold">{admin.name} ({admin.email}) - Child Users: {admin.children?.length || 0}, Total Records: {totalRecords}</h2>
                            <table className="w-full text-left mt-4 table-auto border-collapse border border-slate-400">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border border-slate-300 px-4 py-2">#</th>
                                        <th className="border border-slate-300 px-4 py-2">Child User Name</th>
                                        <th className="border border-slate-300 px-4 py-2">Email</th>
                                        <th className="border border-slate-300 px-4 py-2">Customers</th>
                                        <th className="border border-slate-300 px-4 py-2">Products</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admin.children?.map((child: SuperAdminUsers, childIndex: number) => (
                                        <tr key={child.id} className="border-b">
                                            <td className="border border-slate-300 px-4 py-2">{childIndex + 1}</td>
                                            <td className="border border-slate-300 px-4 py-2">{child.name}</td>
                                            <td className="border border-slate-300 px-4 py-2">{child.email}</td>
                                            <td className="border border-slate-300 px-4 py-2">{child.customers_count}</td>
                                            <td className="border border-slate-300 px-4 py-2">{child.products_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminDashboard;