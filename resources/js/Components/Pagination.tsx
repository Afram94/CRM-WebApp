// PaginationComponent.tsx
import React from 'react';
import { Inertia } from '@inertiajs/inertia';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    onPageClick?: (url: string) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({ links, onPageClick }) => {
    return (
        <div className="mt-4 flex justify-center items-center space-x-4">
            {links.map((link, index) => {
                let content;
                if (link.label === "&laquo; Previous") {
                    content = "← Prev";
                } else if (link.label === "Next &raquo;") {
                    content = "Next →";
                } else {
                    content = link.label;
                }

                return (
                    <button
                        key={index}
                        onClick={() => {
                            if (link.url) {
                                if (onPageClick) {
                                    onPageClick(link.url);
                                } else {
                                    Inertia.visit(link.url);
                                }
                            }
                        }}
                        className={`px-3 py-1 border rounded ${link.active ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-200'}`}
                    >
                        {content}
                    </button>
                );
            })}
        </div>
    );
};

export default PaginationComponent;
