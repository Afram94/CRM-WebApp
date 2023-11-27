import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import Create from '@/Pages/Categories/Create';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaPlus } from 'react-icons/fa';
import { Category } from '@/types';

const CreateCategoriesModal: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <PrimaryButton onClick={() => setModalOpen(true)}>
                <FaPlus/>
                <p className='px-2'>Add Category</p>
                
            </PrimaryButton>

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center">Create New Category</h2>
                    <Create closeModal={() => setModalOpen(false)} />
                </div>
            </Modal>
        </div>
    );
}

export default CreateCategoriesModal;
