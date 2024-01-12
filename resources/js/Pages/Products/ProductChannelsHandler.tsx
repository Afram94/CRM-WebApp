import React, { useEffect } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import { Product } from '@/types';

interface ProductChannelsHandlerProps {
    userId: number | null;
    parentId: number | null;
    onNewProduct: (product: Product) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (product: number) => void;
}

const ProductChannelsHandler: React.FC<ProductChannelsHandlerProps> = ({
    userId, parentId, onNewProduct, onUpdateProduct, onDeleteProduct
}) => {
  const echo = useEcho();

  useEffect(() => {
    if (!echo || !userId) return;

    const userChannel = echo.private(`products-for-user-${userId}`)
      .listen('ProductCreated', (e: { product: Product }) => {
        onNewProduct(e.product);
      })
      .listen('ProductUpdated', (e: { product: Product }) => {
        onUpdateProduct(e.product);
      })
      .listen('ProductDeleted', (e: { productId: number }) => {
        onDeleteProduct(e.productId);
      });

    let parentChannel: any;
    if (parentId && parentId !== userId) {
      parentChannel = echo.private(`products-for-user-${parentId}`)
        .listen('ProductCreated', (e: { product: Product }) => {
          onNewProduct(e.product);
        })
        .listen('ProductUpdated', (e: { product: Product }) => {
          onUpdateProduct(e.product);
        })
        .listen('ProductDeleted', (e: { productId: number }) => {
          onDeleteProduct(e.productId);
        });
    }

    return () => {
      userChannel.stopListening('ProductCreated')
        .stopListening('ProductUpdated')
        .stopListening('ProductDeleted');
      
      if (parentChannel) {
        parentChannel.stopListening('ProductCreated')
          .stopListening('ProductUpdated')
          .stopListening('ProductDeleted');
      }
    };
  }, [echo, userId, parentId, onNewProduct, onUpdateProduct, onDeleteProduct]);

  return null; // This component does not render anything
};

export default ProductChannelsHandler;
