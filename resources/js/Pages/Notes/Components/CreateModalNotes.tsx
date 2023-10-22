import React, { useState, MouseEvent } from 'react';
import Modal from '@/Components/Modal';
import Create from '@/Pages/Notes/Create';
import PrimaryButton from '@/Components/PrimaryButton';
import { Customer } from '@/types';

type CreateModalNotesProps = {
    customerId: number;
};

const CreateModalNotes: React.FC<CreateModalNotesProps> = ({ customerId }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    // Keeps the modal open when clicking "Create New Note" inside a dropdown.
    // Stops the dropdown from affecting the modal.
    const handleButtonClick = (e: MouseEvent) => {
        e.stopPropagation(); // Prevents event from bubbling up, so dropdown won't close
        setModalOpen(true); // Opens the modal
    }

    return (
        <div>
            <PrimaryButton onClick={handleButtonClick}>Create New Note</PrimaryButton>
            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center">Create New Note</h2>
                    <Create customerId={customerId} closeModal={() => setModalOpen(false)} />
                </div>
            </Modal>
        </div>
    );
}

export default CreateModalNotes;
