import { LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Sidebar.css';

const Sidebar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'Wati', label: 'WATI', colorVar: '--color-green' },
    { id: 'Partsmart', label: 'PARTSMART', colorVar: '--color-red' },
    { id: 'Link', label: 'LINK', colorVar: '--color-blue' },
    { id: 'Favorites', label: 'Favourites', colorVar: '--color-yellow' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo" className="sidebar-logo" />
        <h1 className="sidebar-title">Support Response Hub</h1>
      </div>

      <div className="sidebar-filters">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            style={{ '--btn-color': `var(${filter.colorVar})` }}
            onClick={() => onFilterChange(activeFilter === filter.id ? 'All' : filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
