import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setIsSearchOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex" ref={searchRef}>
            <div className="flex lg:ml-6">
                <button className="p-2 text-gray-400 hover:text-gray-500" onClick={handleSearchClick}>
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            {isSearchOpen && (
                <input
                    type="text"
                    placeholder="Search"
                    className="p-2 border border-gray-400"
                />
            )}
        </div>
    );
};

export default SearchBar;
