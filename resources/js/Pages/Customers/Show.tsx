// CustomersList.tsx

import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateModal from '@/Pages/Customers/Components/CreateModal';
import { useState } from 'react';

const Show = ({ auth }: PageProps) => {
    return (
        <MainLayout>
            {auth.customers && auth.customers.length > 0 ? (
                <div className="bg-white h-full p-4">
                    <h3 className="text-xl font-semibold mb-4 flex justify-center">Your Customers:</h3>
                    <div className="w-full flex justify-end my-2">
                        <CreateModal />
                    </div>
                    
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-2 px-6 text-left">Name</th>
                                <th className="py-2 px-6 text-left">Email</th>
                                <th className="py-2 px-6 text-left">Phone Number</th>
                                <th className="py-2 px-6 text-left">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {auth.customers.map((customer) => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={customer.id}>
                                    <td className="py-2 px-6">{customer.name}</td>
                                    <td className="py-2 px-6">{customer.email}</td>
                                    <td className="py-2 px-6">{customer.phone_number}</td>
                                    <td className="py-2 px-6">
                                        <Link href={`/customers/${customer.id}/edit`} className="text-blue-500 hover:text-blue-700">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div>
            ) : (
                <div className="mt-5">You haven't added any customers yet.</div>
            )}
        </MainLayout>
    );
};

export default Show;
