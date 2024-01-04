import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import SelectProduct from '../SelectProduct';  // Adjust the path as necessary
import PrimaryButton from '@/Components/PrimaryButton';
import { FaPlus } from 'react-icons/fa';

const AddProductModal: React.FC<{ customerId: number }> = ({ customerId }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <PrimaryButton onClick={() => setModalOpen(true)}>
                <FaPlus />
                <p className='px-2'>Add Product</p>
            </PrimaryButton>

            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4 flex justify-center">Add Product to Customer</h2>
                    <SelectProduct customerId={customerId} closeModal={() => setModalOpen(false)} />
                </div>
            </Modal>
        </div>
    );
}

export default AddProductModal;
