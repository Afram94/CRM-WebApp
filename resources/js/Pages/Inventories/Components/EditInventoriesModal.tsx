// EditInventoriesModal.tsx
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import Edit from '@/Pages/Inventories/Edit';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaEdit } from 'react-icons/fa';
import { Inventory } from '@/types';

interface EditInventoriesModalProps {
    inventory: Inventory;
    onClose: () => void;
}

const EditInventoriesModal: React.FC<EditInventoriesModalProps> = ({ inventory, onClose }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <PrimaryButton onClick={() => setModalOpen(true)}><FaEdit /></PrimaryButton>

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center">Edit Inventory</h2>
                    {inventory && <Edit inventory={inventory} closeModal={() => { setModalOpen(false); onClose(); }} />}
                    {/* <Edit inventory={inventory} closeModal={() => { setModalOpen(false); onClose(); }} /> */}
                </div>
            </Modal>
        </div>
    );
}

export default EditInventoriesModal;
