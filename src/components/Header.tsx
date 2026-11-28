import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const navItems = [
  { to: '/dashboard', label: 'Koti', end: true },
  { to: '/new', label: 'Uusi' },
  { to: '/history', label: 'Historia' },
  { to: '/stats', label: 'Tilastot' },
  { to: '/records', label: 'Ennätykset' },
];

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path
                d="M1 18q2.5-2 5 0t5 0M21 18q2.5-2 5 0t5 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
              <rect x="12.5" y="2" width="7" height="19" rx="3.5" stroke="var(--color-text)" strokeWidth="2" />
              <circle cx="16" cy="24.5" r="5.5" fill="currentColor" />
              <path d="M16 22V9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="brand-text">AvantoTracker</span>
        </Link>

        <nav className="app-nav" aria-label="Päänavigaatio">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <span className="header-user">{user?.name?.split(' ')[0] ?? 'Käyttäjä'}</span>
          <button type="button" onClick={() => logout()} className="logout-button">
            Kirjaudu ulos
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
