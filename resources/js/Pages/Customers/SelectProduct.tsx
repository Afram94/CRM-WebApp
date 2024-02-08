import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Combobox, Transition } from '@headlessui/react';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';
import { successToast } from '@/Components/toastUtils';

type Product = {
  id: number;
  name: string;
};

type SelectProductProps = {
  customerId: number;
  closeModal: () => void;
};

const SelectProduct: React.FC<SelectProductProps> = ({ customerId, closeModal }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios.get('/get-products') // Adjust the API endpoint as needed
      .then(response => {
        setProducts(response.data);
        /* setSelectedProduct(response.data[0]); // Default to the first product, adjust as needed */
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const filteredProducts = query === ''
    ? products
    : products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleAddProduct = async () => {
    if (!selectedProduct) return;

    try {
      await axios.post(`/customers/${customerId}/addProduct`, { product_id: selectedProduct.id });
      successToast('Product added to customer successfully');
      closeModal();
    } catch (error) {
      console.error('Error adding product to customer:', error);
    }
  };

  return (
    <>
    <div className="w-full max-w-xl min-h-[20rem] mx-auto p-4 bg-white rounded-lg "> {/* Adjust width, padding, and styling as needed */}
      <Combobox value={selectedProduct} onChange={setSelectedProduct}>
        <div className="relative mt-1">
          <Combobox.Input
            className="w-full border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            displayValue={(product: Product) => product?.name ?? ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a product..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <FaChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-in-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-60 min-w-[34rem] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredProducts.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-center text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Combobox.Option
                  key={product.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    }`
                  }
                  value={product}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {product.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-blue-500'
                          }`}
                        >
                          <FaCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
      <div className='mt-4 flex justify-end'>
        <PrimaryButton onClick={handleAddProduct} disabled={!selectedProduct}>
          Add Product
        </PrimaryButton>
      </div>
      </>
  );
};

export default SelectProduct;
