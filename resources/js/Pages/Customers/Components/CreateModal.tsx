import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import Create from '@/Pages/Customers/Create';
import PrimaryButton from '@/Components/PrimaryButton';

const CreateModal: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <PrimaryButton onClick={() => setModalOpen(true)}>Create New Customer</PrimaryButton>

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center">Create New Customer</h2>
                    <Create closeModal={() => setModalOpen(false)} />
                </div>
            </Modal>
        </div>
    );
}

export default CreateModal;
