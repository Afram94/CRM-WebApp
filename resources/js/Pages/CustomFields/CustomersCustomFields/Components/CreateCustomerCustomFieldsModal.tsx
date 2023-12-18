import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import Create from '@/Pages/Customers/Create';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaPlus } from 'react-icons/fa';
import CustomerCustomFieldForm from '../CreateCustomerCustomFieldForm';

const CreateModal: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <PrimaryButton onClick={() => setModalOpen(true)}>
                <FaPlus/>
                <p className='px-2'>Add Customer Custom-Felid</p>
                
            </PrimaryButton>

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center text-slate-700">Add Custom Field</h2>
                    <CustomerCustomFieldForm closeModal={() => setModalOpen(false)} />
                </div>
            </Modal>
        </div>
    );
}

export default CreateModal;
