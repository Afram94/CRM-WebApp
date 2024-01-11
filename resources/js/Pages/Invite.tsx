// /resources/js/Pages/Invite.tsx

import React, { useState } from 'react';
import axios from 'axios';
import MainLayout from '../Layouts/MainLayout';

const Invite: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // Update the URL to match the Laravel route
            const response = await axios.post('/invite', { email });
            setMessage('Invitation sent successfully');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error sending invitation';
            setMessage(errorMessage);
        }
    };

    return (
        <div>
            <MainLayout title='Send Invite'>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email" 
                />
                <button type="submit">Send Invite</button>
            </form>
            {message && <p>{message}</p>}
            </MainLayout>
        </div>
    );
};

export default Invite;
