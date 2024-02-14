// resources/js/components/SuperAdminDashboard.tsx

import React from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { PageProps, SuperAdminUsers, User } from '@/types'; // Assuming your types are exported and can be imported

const SuperAdminDashboard: React.FC<PageProps> = ({ auth }) => {
    const { superadminusers } = auth;

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
                
                {superAdmin && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Super Admin</h2>
                        <p className="bg-gray-100 p-4 rounded-lg">{superAdmin.name}</p>
                    </div>
                )}
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Admins and Their Users</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2">Admin Name</th>
                                    <th className="px-4 py-2">Child Users</th>
                                </tr>
                            </thead>
                            <tbody>
                               
                            {admins.map((admin: SuperAdminUsers) => (
<tr key={admin.id} className="border-b">
<td className="px-4 py-2">{admin.name}</td>
<td className="px-4 py-2">
<ul>
{admin.children && admin.children.map((child: User) => (
<li key={child.id}>{child.name}</li>
))}
</ul>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</div>
</SuperAdminLayout>


    );
};

export default SuperAdminDashboard;
