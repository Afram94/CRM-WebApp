import React, { useEffect } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';

interface UserPermissionsHandlerProps {
    userId: number;
    onPermissionsUpdate: (permissions: string[]) => void;
}

const UserPermissionsHandler: React.FC<UserPermissionsHandlerProps> = ({
    userId, onPermissionsUpdate
}) => {
    const echo = useEcho();

    useEffect(() => {
        if (!echo || !userId) return;
        console.log("here");
        const permissionsChannel = echo.private(`permissions-for-user.${userId}`)
            .listen('UserPermissionsUpdated', (e: { permissions: string[] }) => {
                onPermissionsUpdate(e.permissions);
            });

        return () => {
            permissionsChannel.stopListening('UserPermissionsUpdated');
        };
    }, [echo, userId, onPermissionsUpdate]);

    return null; // This component does not render anything
};

export default UserPermissionsHandler;
