import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'Wati', label: 'WATI', colorVar: '--color-green' },
    { id: 'Partsmart', label: 'PARTSMART', colorVar: '--color-red' },
    { id: 'Link', label: 'LINK', colorVar: '--color-blue' },
  ];

  return (
    <div className="sidebar">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
          style={{ backgroundColor: `var(${filter.colorVar})` }}
          onClick={() => onFilterChange(activeFilter === filter.id ? 'All' : filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
