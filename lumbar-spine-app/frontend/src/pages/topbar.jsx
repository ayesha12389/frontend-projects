// Topbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';

export default function Topbar({ userRole, userAvatar, notifications = 5, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const quickLinks = [
    { tag: '#Severe', filter: 'severity=severe' },
    { tag: '#Moderate', filter: 'severity=moderate' },
    { tag: '#Mild', filter: 'severity=mild' },
    { tag: '#New', filter: 'sort=newest' }
  ];

  const tagColors = {
    '#Severe': '#dc2626',
    '#Moderate': '#f97316',
    '#Mild': '#facc15',
    '#New': '#2563eb',
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Debounced navigation function
  const debouncedNavigate = debounce((term) => {
    if (term.trim() !== '') {
      navigate(`/reports?search=${encodeURIComponent(term)}`);
    }
  }, 500);

  useEffect(() => {
    // Set search term from URL if on reports page
    if (location.pathname === '/reports') {
      const params = new URLSearchParams(location.search);
      const urlSearch = params.get('search') || '';
      setSearchTerm(urlSearch);
      
      // Set active tags based on current filters
      const newActiveTags = [];
      if (params.get('severity') === 'severe') newActiveTags.push('#Severe');
      if (params.get('severity') === 'moderate') newActiveTags.push('#Moderate');
      if (params.get('severity') === 'mild') newActiveTags.push('#Mild');
      if (params.get('sort') === 'newest') newActiveTags.push('#New');
      setActiveTags(newActiveTags);
    } else {
      setSearchTerm('');
      setActiveTags([]);
    }
  }, [location.search, location.pathname]);

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedNavigate(value);
  }
function handleQuickLinkClick(link) {
  const params = new URLSearchParams(location.search);
  
  // Reset pagination when changing filters
  params.set('page', '1');
  
  if (link.tag === '#New') {
    // Toggle newest sort
    if (params.get('sort') === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', 'newest');
    }
  } else {
    // Toggle severity filter
    const severityValue = link.filter.split('=')[1];
    if (params.get('severity') === severityValue) {
      params.delete('severity');
    } else {
      params.set('severity', severityValue);
    }
  }
  
  // Preserve search if exists
  if (!searchTerm) params.delete('search');
  
  navigate(`/reports?${params.toString()}`);
}

  function toggleProfileMenu() {
    setProfileMenuOpen(!profileMenuOpen);
  }

  return (
    <header className="d-none d-sm-flex justify-content-between align-items-center px-3 py-3 bg-transparent text-dark flex-nowrap">
      <div className="d-flex align-items-center gap-2 flex-nowrap">
        <div 
          className="fw-bold fs-5" 
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard  |
        </div>

        <nav className="d-flex gap-1 flex-nowrap">
          {quickLinks.map((link) => {
            const isActive = activeTags.includes(link.tag);
            return (
              <button
                key={link.tag}
                type="button"
                className="btn btn-sm"
                onClick={() => handleQuickLinkClick(link)}
                style={{
                  backgroundColor: isActive ? tagColors[link.tag] : 'transparent',
                  color: isActive ? 'white' : tagColors[link.tag],
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: 'none',
                  textDecoration: isActive ? 'none' : 'underline',
                  borderRadius: '20px',
                  fontSize: '12px',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                }}
              >
                {link.tag}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="d-flex align-items-center gap-3 flex-nowrap">
        <div className="position-relative">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Search reports, users..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ minWidth: '220px' }}
          />
        </div>

        <div className="position-relative">
          <img
            src={`http://localhost:5000/uploads/${userAvatar}` || "https://i.pravatar.cc/40"}
            alt="User Avatar"
            className="rounded-circle"
            style={{ 
              width: '40px', 
              height: '40px', 
              cursor: 'pointer', 
              border: '1px solid #ddd'
            }}
            onClick={toggleProfileMenu}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleProfileMenu()}
          />
          {profileMenuOpen && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded shadow"
              style={{ minWidth: '140px', zIndex: 1050 }}
            >
              <button className="dropdown-item" type="button">Profile</button>
              <button className="dropdown-item" type="button">Settings</button>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  if (onLogout) onLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}