import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate(data.role === 'client' ? '/client/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--surface-2)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'none',
        background: 'linear-gradient(145deg, #4F46E5 0%, #7C3AED 100%)',
        padding: 48, flexDirection: 'column', justifyContent: 'space-between',
      }} className="hidden lg:flex">
        <div style={{ color: '#fff', fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 600 }}>BidPortal</div>
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 40, color: '#fff', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
            Build your freelance<br/>career from campus.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 300, lineHeight: 1.7 }}>
            Hundreds of students have already landed their first client through BidPortal.
          </p>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>© 2025 BidPortal</div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div className="fade-up" style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300 }}>
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: '#FEF2F2', border: '1px solid #FECACA',
              color: '#DC2626', fontSize: 13, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Email address">
              <input type="email" placeholder="you@university.edu"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required style={inputStyle}
              />
            </Field>
            <Field label="Password">
              <input type="password" placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required style={inputStyle}
              />
            </Field>

            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: '13px',
              background: loading ? '#A5B4FC' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              transition: 'background 0.15s',
              boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
            }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1px solid var(--border)',
  borderRadius: 9, fontSize: 14,
  fontFamily: '"DM Sans", sans-serif',
  color: 'var(--text-primary)',
  background: '#fff',
  outline: 'none',
  transition: 'border-color 0.15s',
};

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
      {children}
    </div>
  );
}