import React, { useEffect } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import { Inventory } from '@/types';

interface InventoryChannelsHandlerProps {
    userId: number | null;
    parentId: number | null;
    onNewInventory: (inventory: Inventory) => void;
    onUpdateInventory: (inventory: Inventory) => void;
    /* onDeleteInventory: (inventory: number) => void; */
}

const InventoryChannelsHandler: React.FC<InventoryChannelsHandlerProps> = ({
    userId, parentId, onNewInventory, onUpdateInventory/* , onDeleteInventory */
}) => {
    const echo = useEcho();

    /* console.log("test"); */

    useEffect(() => {
        if (!echo || !userId) return;

        const userChannel = echo.private(`inventories-for-user-${userId}`)
        
            .listen('InventoryCreated', (e: { inventory: Inventory }) => {
                /* console.log("hehe1" + userId); */
                onNewInventory(e.inventory);
            })
            .listen('InventoryUpdated', (e: { inventory: Inventory }) => {
                onUpdateInventory(e.inventory);
            });
            /* .listen('InventoryDeleted', (e: { inventoryId: number }) => {
                onDeleteInventory(e.inventoryId);
            });
 */
        let parentChannel: any;
        if (parentId && parentId !== userId) {
            parentChannel = echo.private(`inventories-for-user-${parentId}`)
                .listen('InventoryCreated', (e: { inventory: Inventory }) => {
                    /* console.log("hehe2" + parentId); */
                    onNewInventory(e.inventory);
                })
                .listen('InventoryUpdated', (e: { inventory: Inventory }) => {
                    onUpdateInventory(e.inventory);
                });
                /* .listen('InventoryDeleted', (e: { inventoryId: number }) => {
                    onDeleteInventory(e.inventoryId);
                }); */
        }

        return () => {
            userChannel.stopListening('InventoryCreated')
            /* console.log("test1"); */
                .stopListening('InventoryUpdated');
                /* .stopListening('InventoryDeleted'); */
            
            if (parentChannel) {
                parentChannel.stopListening('InventoryCreated')
                /* console.log("test2"); */
                    .stopListening('InventoryUpdated');
                    /* .stopListening('InventoryDeleted'); */
            }
        };
    }, [echo, userId, parentId, onNewInventory , onUpdateInventory/* , onDeleteInventory */]);

    return null; // This component does not render anything
};

export default InventoryChannelsHandler;
