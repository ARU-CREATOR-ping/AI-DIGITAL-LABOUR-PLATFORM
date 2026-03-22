import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, role, setUser, setRole, workerProfile } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setUser(null);
    setRole(null);
    navigate('/');
    setMenuOpen(false);
  }

  const workerLinks = [
    { to: '/worker/dashboard', label: '🏠 Home' },
    { to: '/worker/jobs', label: '🔍 Find Jobs' },
    { to: '/worker/applications', label: '📋 My Applications' },
    { to: '/worker/attendance', label: '📸 Attendance' },
  ];
  const clientLinks = [
    { to: '/client/dashboard', label: '🏠 Home' },
    { to: '/client/post-job', label: '➕ Post Job' },
    { to: '/client/applicants', label: '👥 Applicants' },
    { to: '/client/payment', label: '💳 Payment' },
  ];

  const links = role === 'worker' ? workerLinks : role === 'client' ? clientLinks : [];

  if (!user) return null;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: '#fff', borderBottom: '1px solid var(--border)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to={role === 'worker' ? '/worker/dashboard' : '/client/dashboard'} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>⚒️</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>
            AI
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} className="desktop-nav">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: location.pathname === link.to ? 'var(--primary)' : 'var(--text-muted)',
                background: location.pathname === link.to ? '#fff0e8' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: user info + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 15 }}>
              {(workerProfile?.name || user?.name || 'U')[0]}
            </div>
            <div style={{ display: 'none' }} className="user-name-desktop">
              <div style={{ fontSize: 13, fontWeight: 600 }}>{role === 'worker' ? workerProfile?.name : user?.name || 'Client'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{role}</div>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: 'var(--secondary)' }}
            className="hamburger"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ display: 'none' }} id="logout-desktop">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: '#fff', borderTop: '1px solid var(--border)',
          padding: '12px 20px 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        }}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                fontWeight: 600, fontSize: 16,
                color: location.pathname === link.to ? 'var(--primary)' : 'var(--text)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="btn btn-outline btn-full" style={{ marginTop: 16 }}>
            🚪 Logout
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hamburger { display: none !important; }
          #logout-desktop { display: inline-flex !important; }
          .user-name-desktop { display: block !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
