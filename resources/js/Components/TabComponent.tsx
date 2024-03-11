// TabComponent.tsx
import React from 'react';

type TabCategory = {
  name: string;
  Icon: React.ElementType;
};

type TabComponentProps = {
  categories: TabCategory[];
  selectedTab: string;
  onSelect: (tab: string) => void;
};

export const TabComponent: React.FC<TabComponentProps> = ({ categories, selectedTab, onSelect }) => (
  <div className="lg:flex p-1 space-x-1 bg-blue-200/20 rounded-xl my-4">
    {categories.map(({ name, Icon }) => (
      <button
        key={name}
        onClick={() => onSelect(name)}
        className={`w-full py-2.5 text-sm leading-5 font-medium text-gray-500 rounded-lg lg:text-center text-start
          focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-200 ring-white ring-opacity-60
          ${selectedTab === name ? 'bg-indigo-500 text-white shadow' : 'text-slate-600 dark:text-gray-100 hover:bg-white/[0.12] font-semibold'}`}
      >
        <Icon className="inline-block mx-1 mb-1" />{name}
      </button>
    ))}
  </div>
);
