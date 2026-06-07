import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function EditProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', bio: '', skills: '' });
  const [portfolio, setPortfolio] = useState([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', projectUrl: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get(`/users/${user._id}`).then(r => {
      const p = r.data;
      setForm({ name: p.name || '', bio: p.bio || '', skills: (p.skills || []).join(', ') });
      setPortfolio(p.portfolio || []);
    });
  }, [user]);

  // Add this useEffect inside EditProfile, after the existing useEffect:
useEffect(() => {
  if (window.location.hash === '#portfolio') {
    setTimeout(() => {
      document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }
}, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.put('/users/me', {
        name: form.name,
        bio:  form.bio,
        skills:    form.skills.split(',').map(s => s.trim()).filter(Boolean),
        portfolio,
      });
      // Update auth context with new name
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      login({ ...stored, name: data.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setLoading(false); }
  };

  const addPortfolioItem = () => {
    if (!newItem.title.trim()) return;
    setPortfolio(prev => [
      ...prev,
      {
        ...newItem,
        tags: newItem.tags.split(',').map(t => t.trim()).filter(Boolean),
      }
    ]);
    setNewItem({ title: '', description: '', projectUrl: '', tags: '' });
  };

  const removePortfolioItem = (idx) => {
    setPortfolio(prev => prev.filter((_, i) => i !== idx));
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1px solid var(--border)', borderRadius: 9,
    fontSize: 14, fontFamily: '"DM Sans", sans-serif',
    color: 'var(--text-primary)', background: '#fff', outline: 'none',
  };

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <button onClick={() => navigate(`/profile/${user?._id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', fontFamily: '"DM Sans", sans-serif', padding: 0, marginBottom: 8, display: 'block' }}>
              ← Back to Profile
            </button>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Edit Profile
            </h1>
          </div>
          {saved && (
            <span style={{ background: '#ECFDF5', color: '#059669', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 9, border: '1px solid #86EFAC' }}>
              ✓ Changes saved
            </span>
          )}
        </div>

        {/* Basic Info */}
        <form onSubmit={saveProfile}>
          <Section title="Basic Information" subtitle="Your public-facing name and bio">
            <FormRow>
              <Field label="Full Name">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Your full name" />
              </Field>
            </FormRow>
            <Field label="Bio" hint="A short summary about yourself, your background, and what you do">
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} placeholder="Tell clients about yourself, your background, and what makes you unique..." />
            </Field>
            {user?.role === 'student' && (
              <Field label="Skills" hint="Comma-separated list of your technical skills">
                <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} style={inputStyle} placeholder="React, Node.js, Figma, Python..." />
              </Field>
            )}
          </Section>

          {/* Portfolio section — students only */}
          {user?.role === 'student' && (
          <Section id="portfolio-section" title="Portfolio" subtitle="Showcase your best work to win more projects">
              {/* Existing items */}
              {portfolio.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {portfolio.map((item, i) => (
                    <div key={i} style={{
                      background: 'var(--surface-2)', borderRadius: 10,
                      padding: '14px 16px', border: '1px solid var(--border)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>
                        {item.tags?.length > 0 && (
                          <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                            {item.tags.map(t => (
                              <span key={t} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 10, fontWeight: 500, padding: '1px 7px', borderRadius: 5 }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button type="button" onClick={() => removePortfolioItem(i)} style={{
                        background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
                        borderRadius: 7, width: 30, height: 30, cursor: 'pointer',
                        fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new item */}
              <div style={{
                background: 'var(--surface-2)', borderRadius: 12,
                padding: 20, border: '1px dashed var(--border-hover)',
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                  + Add Portfolio Item
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <FormRow>
                    <Field label="Project Title">
                      <input value={newItem.title} onChange={e => setNewItem(n => ({ ...n, title: e.target.value }))} style={inputStyle} placeholder="e.g. E-commerce Website" />
                    </Field>
                    <Field label="Live URL (optional)">
                      <input value={newItem.projectUrl} onChange={e => setNewItem(n => ({ ...n, projectUrl: e.target.value }))} style={inputStyle} placeholder="https://..." />
                    </Field>
                  </FormRow>
                  <Field label="Description">
                    <textarea value={newItem.description} onChange={e => setNewItem(n => ({ ...n, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} placeholder="What did you build? What technologies did you use?" />
                  </Field>
                  <Field label="Tags">
                    <input value={newItem.tags} onChange={e => setNewItem(n => ({ ...n, tags: e.target.value }))} style={inputStyle} placeholder="React, Firebase, Tailwind..." />
                  </Field>
                  <button type="button" onClick={addPortfolioItem} style={{
                    alignSelf: 'flex-start',
                    padding: '9px 20px', background: 'var(--accent-light)',
                    color: 'var(--accent)', border: '1px solid var(--accent)',
                    borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                  }}>Add Item</button>
                </div>
              </div>
            </Section>
          )}

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 9, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, marginBottom: 16 }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={() => navigate(`/profile/${user?._id}`)} style={{
              padding: '12px 24px', border: '1px solid var(--border)', borderRadius: 10,
              background: 'transparent', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', color: 'var(--text-secondary)',
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              padding: '12px 32px', background: loading ? '#A5B4FC' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
            }}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ id, title, subtitle, children }) {
  return (
    <div id={id} className="fade-up" style={{ background: '#fff', borderRadius: 14, padding: '28px 32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: 20 }}>
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--surface-3)' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{title}</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, fontWeight: 300 }}>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  );
}

function FormRow({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>;
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, fontWeight: 300 }}>{hint}</p>}
    </div>
  );
}