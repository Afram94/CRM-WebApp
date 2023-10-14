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
    // Extract numeric pages from links
    const numericPages = links.filter(link => !isNaN(Number(link.label)));

    // Filter the links to show first 5, and the last page
    const filteredLinks = links.filter(link => {
        if (link.label === "&laquo; Previous" || link.label === "Next &raquo;") return true;
        if (numericPages.indexOf(link) < 3) return true; // first 5 pages
        if (numericPages.indexOf(link) === numericPages.length - 1) return true; // last page
        return false;
    });

    // Insert ellipsis if more than 6 links (5 pages + 2 for prev and next)
    if (filteredLinks.length > 7) {
        filteredLinks.splice(6, 0, { url: null, label: "...", active: false });
    }
    return (
        <div className="mt-4 flex justify-center items-center space-x-4">
            {filteredLinks.map((link, index) => {
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
