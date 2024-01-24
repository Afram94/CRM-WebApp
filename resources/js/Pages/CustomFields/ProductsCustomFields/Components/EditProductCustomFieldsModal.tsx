// EditModal.tsx
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { FaEdit } from 'react-icons/fa';
import EditProductCustomFieldsForm from '../EditProductCustomFieldsForm';
import { ProductCustomField } from '@/types';


interface EditModalProps {
    productCustomField: ProductCustomField;
    onClose: () => void; // new prop for closing the modal
}

const EditProductCustomFieldsModal: React.FC<EditModalProps> = ({ productCustomField, onClose }) => {
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
                    <EditProductCustomFieldsForm productCustomField={productCustomField} closeModal={()=> setModalOpen(false)} /> {/* Place EditProduct inside the modal */}
                </div>
            </Modal>
        </div>
    );
}

export default EditProductCustomFieldsModal;
