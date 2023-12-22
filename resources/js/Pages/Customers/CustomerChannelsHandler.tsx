import React, { useEffect, useState } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import { Customer } from '@/types';

interface CustomerChannelsHandlerProps {
    userId: number | null;
    parentId: number | null;
    onNewCustomer: (customer: Customer) => void;
    onUpdateCustomer: (customer: Customer) => void;
    onDeleteCustomer: (customer: number) => void;
    
}

const CustomerChannelsHandler: React.FC<CustomerChannelsHandlerProps> = ({userId, parentId, onNewCustomer, onUpdateCustomer, onDeleteCustomer }) => {
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

      console.log("Update_1")
        const updateUserChannel = echo.private(`customers-for-user-${userId}`)
        .listen('CustomerUpdated', (e: { customer: Customer }) => {
          onUpdateCustomer(e.customer);
        });

        let updateParentChannel: any;
      if (parentId) {
        console.log("Update_2")
        updateParentChannel = echo.private(`customers-for-user-${parentId}`)
          .listen('CustomerUpdated', (e: { customer: Customer }) => {
            onUpdateCustomer(e.customer);
          });
      }


      console.log("Delete_1")
        const deleteUserChannel = echo.private(`customers-for-user-${userId}`)
        .listen('CustomerDeleted', (e: { customerId: number }) => {
          onDeleteCustomer(e.customerId);
        });

        let deleteParentChannel: any;
      if (parentId) {
        console.log("Delete_2")
        deleteParentChannel = echo.private(`customers-for-user-${parentId}`)
          .listen('CustomerDeleted', (e: { customerId: number }) => {
            onDeleteCustomer(e.customerId);
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

        console.log("Update_clear_1")
        updateUserChannel.stopListening('CustomerUpdated');
        if (updateParentChannel) {
          console.log("Update_clear_2")
          updateParentChannel.stopListening('CustomerUpdated');
        }

        console.log("Delete_clear_1")
        deleteUserChannel.stopListening('CustomerDeleted');
        if (deleteParentChannel) {
          console.log("Delete_clear_2")
          deleteParentChannel.stopListening('CustomerDeleted');
        }

      };
    }
  }, [echo, userId, onNewCustomer]);

  // This component doesn't render anything; it's just for setting up WebSocket subscriptions
  return null;
};

export default CustomerChannelsHandler;
