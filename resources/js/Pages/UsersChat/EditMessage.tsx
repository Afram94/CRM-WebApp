// EditMessage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface IMessage {
    id: number;
    from_user_id: number;
    to_user_id: number;
    message: string;
    // You might not need isSender or createdAt here depending on your modal's content
  }

interface EditMessageProps {
    message: IMessage;
    closeModal: () => void;
    onMessageUpdated: (updatedMessage: IMessage) => void;
}

const EditMessage: React.FC<EditMessageProps> = ({ message, closeModal, onMessageUpdated }) => {
    const [text, setText] = useState(message.message);

    const handleSubmit = async () => {
        try {
            const response = await axios.patch(`/chat/update-message/${message.id}`, { message: text });
            onMessageUpdated({...message, message: text}); // Pass the updated message back up
            closeModal(); // Close the modal upon successful update
        } catch (error) {
            console.error("Updating message failed: ", error);
        }
    };

    return (
        <>
            <TextInput
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className='mt-3'>
                <PrimaryButton onClick={handleSubmit}>Update</PrimaryButton>
            </div>
        </>
    );
};

export default EditMessage;
