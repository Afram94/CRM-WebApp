import React, { useEffect, useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { PageProps, SuperAdminUsers } from '@/types'; // Adjusted import
import axios from 'axios';
import UserSwitch from '@/Components/UserSwitch';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';

const SuperAdminDashboard: React.FC<PageProps> = ({ auth }) => {
    // State for holding and filtering users
    const [filteredUsers, setFilteredUsers] = useState<SuperAdminUsers[]>(auth.superadminusers);
    const [searchTerm, setSearchTerm] = useState('');

    // No need to separate users here since all operations are on filteredUsers now

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredUsers(auth.superadminusers); // Reset to original list if search is cleared
            return;
        }

        if (searchTerm.length >= 3) {
            // Fetch filtered users based on search term
            const fetchFilteredUsers = async () => {
                try {
                    const response = await axios.get(`/superadmin/dashboard?search=${searchTerm}`);
                    if (response.data && response.data.auth && response.data.auth.superadminusers) {
                        setFilteredUsers(response.data.auth.superadminusers);
                    }
                } catch (error) {
                    console.error('Failed to fetch filtered users:', error);
                }
            };

            fetchFilteredUsers();
        } else {
            setFilteredUsers(auth.superadminusers); // Reset to original list if searchTerm is less than 3 chars
        }
    }, [searchTerm, auth.superadminusers]);

    const handleReset = () => {
        setSearchTerm('');
    };

    const toggleUserActive = (userId: number) => {
        axios.post(`/users/${userId}/toggle-active`)
            .then(response => {
                // Upon successful toggle, refresh or update user list here
                const updatedUsers = filteredUsers.map(user => {
                    if (user.id === userId) {
                        return { ...user, is_active: !user.is_active };
                    }
                    return user;
                });
                setFilteredUsers(updatedUsers);
            })
            .catch(error => {
                console.error("Error toggling user's status", error);
            });
    };

    return (
        <SuperAdminLayout>
            <div className="p-8">
                <h1 className="text-2xl font-semibold mb-6">Super Admin Dashboard</h1>

                <TextInput
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className='flex gap-2'
                />
                <DangerButton onClick={handleReset}>Reset</DangerButton>
                
                {filteredUsers.filter(user => user.user_id === null).map((admin, index) => {
                    const children = filteredUsers.filter(child => child.user_id === admin.id);
                    const totalRecordsForAdmin = (admin.customers_count ?? 0) + (admin.products_count ?? 0);
                    const totalRecordsForChildren = children.reduce((acc, child) => acc + ((child.customers_count ?? 0) + (child.products_count ?? 0)), 0);
                    const totalRecords = totalRecordsForAdmin + totalRecordsForChildren;

                    return (
                        <div key={admin.id} className="mb-8">
                            <h2 className="text-xl font-semibold">{admin.name} ({admin.email}) - Child Users: {children.length}, Total Records: {totalRecords}</h2>
                            <table className="w-full text-left mt-4 table-auto border-collapse border border-slate-400">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border border-slate-300 px-4 py-2">#</th>
                                        <th className="border border-slate-300 px-4 py-2">Child User Name</th>
                                        <th className="border border-slate-300 px-4 py-2">Email</th>
                                        <th className="border border-slate-300 px-4 py-2">Customers</th>
                                        <th className="border border-slate-300 px-4 py-2">Products</th>
                                        <th className="border border-slate-300 px-4 py-2">Active</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {children.map((child, childIndex) => (
                                        <tr key={child.id}>
                                            <td className="border border-slate-300 px-4 py-2">{childIndex + 1}</td>
                                            <td className="border border-slate-300 px-4 py-2">{child.name}</td>
                                            <td className="border border-slate-300 px-4 py-2">{child.email}</td>
                                            <td className="border border-slate-300 px-4 py-2">{child.customers_count}</td>
                                            <td className="border border-slate-300 px-4 py-2">{child.products_count}</td>
                                            <td className="border border-slate-300 px-4 py-2">
                                                <UserSwitch
                                                    isActive={child.is_active}
                                                    onChange={() => toggleUserActive(child.id)}
                                                />
                                            </td>
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