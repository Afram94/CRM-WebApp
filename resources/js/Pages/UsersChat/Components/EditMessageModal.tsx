// EditMessageModal.tsx
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import EditMessage from '../EditMessage';

interface IMessage {
    id: number;
    from_user_id: number;
    to_user_id: number;
    message: string;
    // You might not need isSender or createdAt here depending on your modal's content
  }

interface EditMessageModalProps {
    message: IMessage;
    onMessageUpdated: (updatedMessage: IMessage) => void;
}

const EditMessageModal: React.FC<EditMessageModalProps> = ({ message, onMessageUpdated }) => {
    const [isModalOpen, setModalOpen] = useState(true); // Assuming modal opens as soon as this component is rendered

    const closeModal = () => {
        setModalOpen(false);
        // Any cleanup or state reset logic can go here
    };

    return (
        <Modal show={isModalOpen} onClose={closeModal}>
            <div className="p-4">
                <h2 className="text-lg font-medium mb-4">Edit Message</h2>
                <EditMessage 
                    message={message} 
                    closeModal={closeModal} 
                    onMessageUpdated={onMessageUpdated} 
                />
            </div>
        </Modal>
    );
};

export default EditMessageModal;
