// EditProductModal.tsx
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import Edit from '@/Pages/Users/Edit';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaEdit } from 'react-icons/fa';
import { User } from '@/types';

interface EditProductModalProps {
    user: User;
    onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ user, onClose }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <PrimaryButton onClick={() => setModalOpen(true)}><FaEdit /></PrimaryButton>

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center">Edit Product</h2>
                    <Edit user={user} closeModal={() => { setModalOpen(false); onClose(); }} />
                </div>
            </Modal>
        </div>
    );
}

export default EditProductModal;
