// EditCategoryModal.tsx
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import Edit from '@/Pages/Categories/Edit';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaEdit } from 'react-icons/fa';
import { Category } from '@/types';

interface EditCategoryModalProps {
    category: Category;
    onClose: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ category, onClose }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <PrimaryButton onClick={() => setModalOpen(true)}><FaEdit /></PrimaryButton>

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center">Edit Product</h2>
                    <Edit category={category} closeModal={() => { setModalOpen(false); onClose(); }} />
                </div>
            </Modal>
        </div>
    );
}

export default EditCategoryModal;
