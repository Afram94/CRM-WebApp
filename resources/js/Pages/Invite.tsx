import React, { useState } from 'react';
import axios from 'axios';
import MainLayout from '../Layouts/MainLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

const Invite: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('/invite', { email });
            setMessage('Invitation sent successfully');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error sending invitation';
            setMessage(errorMessage);
        }
    };

    return (
        <>
            <MainLayout title='Send Invite'>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl dark:bg-red-500 bg-red-200 font-semibold mb-4 flex justify-center rounded-lg text-red-600 dark:text-red-100 mx-80 px-3">Admin User Invitation</h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-6">
                    Welcome to the Admin User Invitation page. Here, as an admin, you can invite users to join your organization's system. By sending an invitation, the user will receive an email containing a registration link.
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-6 mt-4">
                    Once the user clicks on the link and completes the registration process, they will have an account associated with your organization. However, please note that initially, the user will not have any permissions.
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-6 mt-4">
                    To grant permissions to the user, navigate to the user management page and select the specific user. From there, you can assign the necessary permissions to them.
                </p>
            </div>

                <div className='flex flex-col justify-center items-center mt-12 gap-2'>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextInput 
                            type="email" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email to invite.."
                            isFocused={true}
                        />
                    </form>
                    <div>
                        <PrimaryButton type="submit" className='w-44 text-center flex justify-center'>
                            Send Invite
                        </PrimaryButton>
                    </div>
                </div>
                {message && <p className="mt-4">{message}</p>}
            </MainLayout>
        </>
    );
};

export default Invite;
