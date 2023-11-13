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
    // Extract numeric pages from links and find the current page index
    const numericPages = links.filter(link => !isNaN(Number(link.label)));
    const currentPageIndex = numericPages.findIndex(link => link.active);

    // Create a new array to hold the final set of pagination links to display
    let finalLinks = [];

    // Always add the first page and last page links if not included in our range
    const firstPageLink = numericPages[0];
    const lastPageLink = numericPages[numericPages.length - 1];

    // Define the range of page numbers to display around the current page
    const pageWindow = 2; // Determines how many pages to show around the current page
    const startRange = Math.max(currentPageIndex - pageWindow, 0);
    const endRange = Math.min(currentPageIndex + pageWindow, numericPages.length - 1);

    // Add the 'Previous' button link
    finalLinks.push(links[0]);

    // Add the first page if it's not in the initial range
    if (startRange > 0) {
        finalLinks.push(firstPageLink);
        if (startRange > 1) { // If we're skipping pages, add an ellipsis
            finalLinks.push({ url: null, label: '...', active: false });
        }
    }

    // Add the numeric page links in the range
    finalLinks = finalLinks.concat(numericPages.slice(startRange, endRange + 1));

    // Add the last page if it's not in the ending range
    if (endRange < numericPages.length - 1) {
        if (endRange < numericPages.length - 2) { // If we're skipping pages, add an ellipsis
            finalLinks.push({ url: null, label: '...', active: false });
        }
        finalLinks.push(lastPageLink);
    }

    // Add the 'Next' button link
    finalLinks.push(links[links.length - 1]);

    return (
        <div className="mt-4 flex justify-center items-center space-x-4">
            {finalLinks.map((link, index) => {
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
                        disabled={!link.url}
                        onClick={() => {
                            if (link.url) {
                                if (onPageClick) {
                                    onPageClick(link.url);
                                } else {
                                    Inertia.visit(link.url);
                                }
                            }
                        }}
                        className={`px-3 py-1 border rounded ${link.active ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-200'} ${!link.url ? 'cursor-default' : ''}`}
                    >
                        {content}
                    </button>
                );
            })}
        </div>
    );
};

export default PaginationComponent;

