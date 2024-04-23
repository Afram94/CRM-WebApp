import React from 'react';
/* import { InertiaLink, usePage } from '@inertiajs/inertia-react'; */
import MainLayout from '@/Layouts/MainLayout';
import NotificationDropdown from '@/Components/NotificationDropdown';  // Ensure this is imported
import { PageProps } from '@/types';

const Show: React.FC<PageProps> = ({ auth }) => {

    console.log(auth.notifications);
    /* const { auth } = usePage().props; */
    const { notifications } = auth;

    return (
        <MainLayout title=''>
            <NotificationDropdown notifications={notifications} />
            Other UI elements
        </MainLayout>
    );
};

export default Show;
