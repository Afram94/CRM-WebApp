import React, { useEffect, useState } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import { Product } from '@/types';

interface ProductChannelsHandlerProps {
    userId: number | null;
    parentId: number | null;
    onNewProduct: (product: Product) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (product: number) => void;
    
}

const ProductChannelsHandler: React.FC<ProductChannelsHandlerProps> = ({userId, parentId, onNewProduct, onUpdateProduct, onDeleteProduct }) => {
  const echo = useEcho();


  useEffect(() => {
    if (echo && userId) {
        console.log("Product_Create_1")
        const userChannel = echo.private(`products-for-user-${userId}`)
        .listen('ProductCreated', (e: { product: Product }) => {
          onNewProduct(e.product);
        });

        let parentChannel: any;
      if (parentId) {
        console.log("Product_Create_2")
        parentChannel = echo.private(`products-for-user-${parentId}`)
          .listen('ProductCreated', (e: { product: Product }) => {
            onNewProduct(e.product);
          });
      }

      console.log("Update_1")
        const updateUserChannel = echo.private(`products-for-user-${userId}`)
        .listen('ProductUpdated', (e: { product: Product }) => {
          onUpdateProduct(e.product);
        });

        let updateParentChannel: any;
      if (parentId) {
        console.log("Update_2")
        updateParentChannel = echo.private(`products-for-user-${parentId}`)
          .listen('ProductUpdated', (e: { product: Product }) => {
            onUpdateProduct(e.product);
          });
      }


      console.log("Delete_1")
        const deleteUserChannel = echo.private(`products-for-user-${userId}`)
        .listen('ProductDeleted', (e: { productId: number }) => {
          onDeleteProduct(e.productId);
        });

        let deleteParentChannel: any;
      if (parentId) {
        console.log("Delete_2")
        deleteParentChannel = echo.private(`products-for-user-${parentId}`)
          .listen('ProductDeleted', (e: { productId: number }) => {
            onDeleteProduct(e.productId);
          });
      }

      

      // Cleanup function to unsubscribe from channels
      return () => {
        console.log("product_clear_1")
        userChannel.stopListening('ProductCreated');
        if (parentChannel) {
          console.log("product_clear_2")
          parentChannel.stopListening('ProductCreated');
        }

        console.log("Update_clear_1")
        updateUserChannel.stopListening('ProductUpdated');
        if (updateParentChannel) {
          console.log("Update_clear_2")
          updateParentChannel.stopListening('ProductUpdated');
        }

        console.log("Delete_clear_1")
        deleteUserChannel.stopListening('ProductDeleted');
        if (deleteParentChannel) {
          console.log("Delete_clear_2")
          deleteParentChannel.stopListening('ProductDeleted');
        }

      };
    }
  }, [echo, userId, onNewProduct]);

  // This component doesn't render anything; it's just for setting up WebSocket subscriptions
  return null;
};

export default ProductChannelsHandler;
