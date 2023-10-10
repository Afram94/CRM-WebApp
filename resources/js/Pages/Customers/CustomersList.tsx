// CustomersList.tsx

import { PageProps } from '@/types';

const CustomersList = ({ auth }: PageProps) => {
    return (
        <>
            {auth.customers && auth.customers.length > 0 ? (
                <div className="mt-5">
                    <h3 className="text-xl font-semibold mb-4">Your Customers:</h3>
                    <ul>
                        {auth.customers.map((customer) => (
                            <li key={customer.id}>{customer.name}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="mt-5">You haven't added any customers yet.</div>
            )}
        </>
    );
};

export default CustomersList;
