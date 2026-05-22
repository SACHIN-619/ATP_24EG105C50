import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--accent)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 4L10 9L12 6L14 12H2Z" fill="white" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{
            fontFamily: '"Playfair Display", serif', fontSize: 18,
            fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.3px',
          }}>
            Bid<span style={{ color: 'var(--accent)' }}>Portal</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <NavLink to="/projects" active={isActive('/projects')}>Browse Projects</NavLink>

          {user ? (
            <>
              <NavLink
                to={user.role === 'client' ? '/client/dashboard' : '/student/dashboard'}
                active={isActive('/client/dashboard') || isActive('/student/dashboard')}
              >
                Dashboard
              </NavLink>

              <div style={{ height: 20, width: 1, background: 'var(--border)', margin: '0 8px' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Clickable avatar → profile page */}
                <div
                  onClick={() => navigate(`/profile/${user._id}`)}
                  title="View Profile"
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 13,
                    cursor: 'pointer', transition: 'opacity 0.15s', flexShrink: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  style={{
                    padding: '6px 14px', border: '1px solid var(--border)',
                    borderRadius: 8, background: 'transparent', fontSize: 13,
                    color: 'var(--text-secondary)', cursor: 'pointer',
                    fontFamily: '"DM Sans", sans-serif', fontWeight: 500, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" active={isActive('/login')}>Login</NavLink>
              <Link to="/signup" style={{
                padding: '8px 20px', background: 'var(--accent)', color: '#fff',
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                textDecoration: 'none', marginLeft: 4,
                fontFamily: '"DM Sans", sans-serif', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: '6px 12px', borderRadius: 7, fontSize: 13, fontWeight: 500,
      textDecoration: 'none',
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      background: active ? 'var(--accent-light)' : 'transparent',
      transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif',
    }}>
      {children}
    </Link>
  );
}