// SelectCustomer.tsx

import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Combobox, Transition } from '@headlessui/react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';

type Customer = {
  id: number;
  name: string;
};

type SelectCustomerProps = {
  onCustomerSelect: (customerId: number) => void; // Function to handle customer selection
};

const SelectCustomer: React.FC<SelectCustomerProps> = ({ onCustomerSelect }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios.get('/get-customers') // Adjust the API endpoint as needed
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const filteredCustomers = query === ''
    ? customers
    : customers.filter((customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (selectedCustomer) {
      onCustomerSelect(selectedCustomer.id);
    }
  }, [selectedCustomer, onCustomerSelect]);

  return (
    <div className="w-full max-w-xl min-h-[20rem] mx-auto p-4 bg-white rounded-lg">
      <Combobox value={selectedCustomer} onChange={setSelectedCustomer}>
        <div className="relative mt-1">
          <Combobox.Input
            className="w-full border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            displayValue={(customer: Customer) => customer?.name ?? ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a customer..."
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
          <Combobox.Options className=" mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredCustomers.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-center text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <Combobox.Option
                  key={customer.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    }`
                  }
                  value={customer}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {customer.name}
                      </span>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-blue-500'
                          }`}
                        >
                          <FaCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
};

export default SelectCustomer;
