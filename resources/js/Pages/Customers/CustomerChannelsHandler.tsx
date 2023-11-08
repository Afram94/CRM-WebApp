import React, { useEffect, useState } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import { Customer } from '@/types';

interface CustomerChannelsHandlerProps {
    userId: number | null;
    parentId: number | null;
    onNewCustomer: (customer: Customer) => void;
    
}

const CustomerChannelsHandler: React.FC<CustomerChannelsHandlerProps> = ({userId, parentId, onNewCustomer }) => {
  const echo = useEcho();


  useEffect(() => {
    if (echo && userId) {
        console.log("Create_1")
        const userChannel = echo.private(`customers-for-user-${userId}`)
        .listen('CustomerCreated', (e: { customer: Customer }) => {
          onNewCustomer(e.customer);
        });

        let parentChannel: any;
      if (parentId) {
        console.log("Create_2")
        parentChannel = echo.private(`customers-for-user-${parentId}`)
          .listen('CustomerCreated', (e: { customer: Customer }) => {
            onNewCustomer(e.customer);
          });
      }

      // Cleanup function to unsubscribe from channels
      return () => {
        console.log("clear_1")
        userChannel.stopListening('CustomerCreated');
        if (parentChannel) {
          console.log("clear_2")
          parentChannel.stopListening('CustomerCreated');
        }

      };
    }
  }, [echo, userId, onNewCustomer]);

  // This component doesn't render anything; it's just for setting up WebSocket subscriptions
  return null;
};

export default CustomerChannelsHandler;
