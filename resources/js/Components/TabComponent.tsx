// TabComponent.tsx
import React from 'react';
import { Tab } from '@headlessui/react';

type TabCategory = {
  name: string;
  Icon: React.ElementType; // This specifies that Icon is a React component
};

type TabComponentProps = {
  categories: TabCategory[];
  selectedTab: string;
  onSelect: (tab: string) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const TabComponent: React.FC<TabComponentProps> = ({ categories, selectedTab, onSelect }) => (
  <Tab.Group>
    <Tab.List className="lg:flex p-1 space-x-1 bg-blue-200/20 rounded-xl my-4">
  {categories.map(({ name, Icon }) => (
    <Tab
      key={name}
      onClick={() => onSelect(name)}
      className={({ selected }) =>
        classNames(
          'w-full py-2.5 text-sm leading-5 font-medium text-gray-500 rounded-lg lg:text-center text-start',
          'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-200 ring-white ring-opacity-60',
          selected ? 'bg-indigo-500 text-white shadow' : 'text-slate-600 dark:text-gray-100 hover:bg-white/[0.12] font-semibold'
        )
      }
    >
      <Icon className="inline-block mx-1 mb-1" />{name}
    </Tab>
  ))}
</Tab.List>
    <Tab.Panels className="mt-2">
      {/* Panels go here */}
    </Tab.Panels>
  </Tab.Group>
);
