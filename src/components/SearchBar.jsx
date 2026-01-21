import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="search-bar-container">
            <Search className="search-icon" size={20} />
            <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
