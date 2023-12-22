// EditModal.tsx
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { FaEdit } from 'react-icons/fa';
import EditCustomerCustomFields from '../EditCustomerCustomFields';
import { CustomerCustomField } from '@/types';


interface EditModalProps {
    customerCustomField: CustomerCustomField;
    onClose: () => void; // new prop for closing the modal
}

const EditModal: React.FC<EditModalProps> = ({ customerCustomField, onClose }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            {/* <PrimaryButton onClick={() => setModalOpen(true)}><FaEdit /></PrimaryButton> */}
            <div onClick={() => setModalOpen(true)}>
                <FaEdit size={17} color="#00A2F3"/>
            </div>

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center">Edit Custom Filed</h2>
                    <EditCustomerCustomFields customerCustomField={customerCustomField} closeModal={()=> setModalOpen(false)} /> {/* Place EditCustomer inside the modal */}
                </div>
            </Modal>
        </div>
    );
}

export default EditModal;
