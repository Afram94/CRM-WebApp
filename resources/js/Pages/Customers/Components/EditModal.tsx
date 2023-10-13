// EditModal.tsx
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import Edit from '@/Pages/Customers/Edit'; // <-- Import EditCustomer
import PrimaryButton from '@/Components/PrimaryButton';
import { Customer } from '@/types';
import { FaEdit } from 'react-icons/fa';


interface EditModalProps {
    customer: Customer;
    onClose: () => void; // new prop for closing the modal
}

const EditModal: React.FC<EditModalProps> = ({ customer, onClose }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <PrimaryButton onClick={() => setModalOpen(true)}><FaEdit /></PrimaryButton>

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center">Edit Customer</h2>
                    <Edit customer={customer} closeModal={()=> setModalOpen(false)} /> {/* Place EditCustomer inside the modal */}
                </div>
            </Modal>
        </div>
    );
}

export default EditModal;
