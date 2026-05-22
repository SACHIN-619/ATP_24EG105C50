import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Signup() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: params.get('role') || 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data);
      navigate(data.role === 'client' ? '/client/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1px solid var(--border)',
    borderRadius: 9, fontSize: 14,
    fontFamily: '"DM Sans", sans-serif',
    color: 'var(--text-primary)',
    background: '#fff', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--surface-2)' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(145deg, #4F46E5 0%, #7C3AED 100%)',
        padding: 48, flexDirection: 'column', justifyContent: 'space-between',
        display: 'none',
      }} className="hidden lg:flex">
        <div style={{ color: '#fff', fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 600 }}>BidPortal</div>
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 40, color: '#fff', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
            Your first client<br/>is waiting.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 300 }}>
            Join the platform where university talent meets real work.
          </p>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>© 2025 BidPortal</div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div className="fade-up" style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300 }}>
              Join BidPortal as a client or student freelancer
            </p>
          </div>

          {/* Role toggle */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: 24,
            background: 'var(--surface-3)', borderRadius: 10, padding: 4,
          }}>
            {['client', 'student'].map(r => (
              <button key={r} type="button"
                onClick={() => setForm(f => ({ ...f, role: r }))}
                style={{
                  flex: 1, padding: '9px',
                  borderRadius: 8, border: 'none',
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '"DM Sans", sans-serif',
                  transition: 'all 0.15s',
                  background: form.role === r ? '#fff' : 'transparent',
                  color: form.role === r ? 'var(--accent)' : 'var(--text-secondary)',
                  boxShadow: form.role === r ? 'var(--shadow-sm)' : 'none',
                  textTransform: 'capitalize',
                }}>
                {r === 'client' ? '🏢 Client' : '🎓 Student'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: '#FEF2F2', border: '1px solid #FECACA',
              color: '#DC2626', fontSize: 13, marginBottom: 16,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Arjun Sharma' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@university.edu' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
                <input type={type} placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  required style={inputStyle}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: '13px',
              background: loading ? '#A5B4FC' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
            }}>
              {loading ? 'Creating account...' : `Create ${form.role} account`}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}