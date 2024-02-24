/* import React, { useEffect } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import { User } from '@/types';

interface UserChannelsHandlerProps {
    userId: number;
    onUpdateUser: (user: User) => void;
}

const UserChannelsHandler: React.FC<UserChannelsHandlerProps> = ({ userId, onUpdateUser }) => {
  const echo = useEcho();

  useEffect(() => {
    if (!echo || !userId) return;

    const channelName = `users-for-user-${userId}`;
    console.log(`Subscribing to channel: ${channelName}`);

    const userChannel = echo.private(channelName)
      .listen('.UserUpdated', (e: {user : User}) => {
        console.log("WebSocket event received:", e);
        onUpdateUser(e.user);
      });
    return () => {
        
      userChannel.stopListening('UserUpdated')
    };
  }, [echo, userId, onUpdateUser]);

  return null; // This component does not render anything
};

export default UserChannelsHandler; */

import React, { useEffect } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import { User } from '@/types';

interface UserChannelsHandlerProps {
    userId: number | null;
    parentId: number | null;
    onUpdateUser: (user: User) => void;
}

const UserChannelsHandler: React.FC<UserChannelsHandlerProps> = ({
    userId, parentId, onUpdateUser,
}) => {
    const echo = useEcho();

    useEffect(() => {
        if (!echo || !userId) return;

        const userChannel = echo.private(`users-for-user-${userId}`)
            
            .listen('UserUpdated', (e: { user: User }) => {
                onUpdateUser(e.user);
            })
            

        let parentChannel: any;
        if (parentId && parentId !== userId) {
            parentChannel = echo.private(`users-for-user-${parentId}`)
                
                .listen('UserUpdated', (e: { user: User }) => {
                    onUpdateUser(e.user);
                })
                
        }

        return () => {
            userChannel.stopListening('UserUpdated');
                
            
            if (parentChannel) {
                parentChannel.stopListening('UserUpdated')
                    
            }
        };
    }, [echo, userId, parentId, onUpdateUser]);

    return null; // This component does not render anything
};

export default UserChannelsHandler;
