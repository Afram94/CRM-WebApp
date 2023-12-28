import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { FaPlus } from 'react-icons/fa';
import CreateProductCustomFieldForm from '../CreateProductCustomFieldForm';
import GradientButton from '@/Components/GradientButton';

const CreateProductCustomFieldFormModal: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
        <GradientButton
            label="Add New"
            onClick={() => setModalOpen(true)}
            icon={<FaPlus className="text-lg" />}
            className="bg-red-500"
        />

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center text-slate-700">Add Custom Field</h2>
                    <CreateProductCustomFieldForm closeModal={() => setModalOpen(false)} />
                </div>
            </Modal>
        </div>
    );
}

export default CreateProductCustomFieldFormModal;
