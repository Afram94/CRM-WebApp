import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FaCaretDown, FaCheck } from 'react-icons/fa';  // Importing Font Awesome icons

interface OptionType {
  label: string;
  value: string;
}

interface ReusableListboxProps {
  options: OptionType[];
  selected: OptionType;
  onChange: (selected: OptionType) => void;
  className?: string;
  renderOption?: (option: OptionType) => React.ReactNode;
}

const ReusableListbox: React.FC<ReusableListboxProps> = ({ options, selected, onChange, className }) => {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className={`relative mt-1 ${className}`}>
        <Listbox.Button className={`relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm text-gray-900 dark:text-white`}>
          <span className="block truncate">{selected.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FaCaretDown className="text-gray-700 dark:text-gray-300" /> {/* Adjust icon color for dark mode */}
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option, idx) => (
              <Listbox.Option key={idx} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 dark:bg-amber-700 text-amber-900 dark:text-white' : 'text-gray-900 dark:text-gray-300'}`} value={option}>
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600 dark:text-amber-300">
                        <FaCheck /> {/* Adjust icon color for dark mode */}
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default ReusableListbox;
