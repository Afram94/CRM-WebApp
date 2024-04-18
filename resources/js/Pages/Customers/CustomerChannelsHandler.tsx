import React, { useEffect } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import { Customer } from '@/types';

interface CustomerChannelsHandlerProps {
    userId: number | null;
    parentId: number | null;
    onNewCustomer: (customer: Customer) => void;
    onUpdateCustomer: (customer: Customer) => void;
    onDeleteCustomer: (customer: number) => void;
    onNewNotification: (notification: { id: number, title: string, message: string, seen: boolean }) => void;
}

const CustomerChannelsHandler: React.FC<CustomerChannelsHandlerProps> = ({
    userId, parentId, onNewCustomer, onUpdateCustomer, onDeleteCustomer, onNewNotification
}) => {
    const echo = useEcho();

    useEffect(() => {
        if (!echo || !userId) return;

        const userChannel = echo.private(`customers-for-user-${userId}`)
            .listen('CustomerCreated', (e: { customer: Customer }) => {
                onNewCustomer(e.customer);
            })
            .listen('CustomerUpdated', (e: { customer: Customer }) => {
                onUpdateCustomer(e.customer);
            })
            .listen('CustomerDeleted', (e: { customerId: number }) => {
                onDeleteCustomer(e.customerId);
            });

        const notificationChannel = echo.private(`notifications-for-user-${userId}`)
            .listen('NotificationCreated', (notification: { id: number, title: string, message: string, seen: boolean }) => {
                onNewNotification(notification);
                console.log("here");
            });

        let parentChannel: any;
        if (parentId && parentId !== userId) {
            parentChannel = echo.private(`customers-for-user-${parentId}`)
                .listen('CustomerCreated', (e: { customer: Customer }) => {
                    onNewCustomer(e.customer);
                })
                .listen('CustomerUpdated', (e: { customer: Customer }) => {
                    onUpdateCustomer(e.customer);
                })
                .listen('CustomerDeleted', (e: { customerId: number }) => {
                    onDeleteCustomer(e.customerId);
                });
        }

        return () => {
            userChannel.stopListening('CustomerCreated')
                .stopListening('CustomerUpdated')
                .stopListening('CustomerDeleted');
            
            notificationChannel.stopListening('NotificationCreated');

            if (parentChannel) {
                parentChannel.stopListening('CustomerCreated')
                    .stopListening('CustomerUpdated')
                    .stopListening('CustomerDeleted');
            }
        };
    }, [echo, userId, parentId, onNewCustomer, onUpdateCustomer, onDeleteCustomer, onNewNotification]);

    return null; // This component does not render anything
};

export default CustomerChannelsHandler;
