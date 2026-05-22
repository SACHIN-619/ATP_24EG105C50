import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ProjectForm() {
  const [form, setForm] = useState({ title: '', description: '', budget: '', deadline: '', tags: '', currency: 'INR' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await api.post('/projects', { ...form, budget: Number(form.budget), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 9, fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: 'var(--text-primary)', background: '#fff', outline: 'none' };

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh', padding: '48px 24px' }}>
      <div className="fade-up" style={{ maxWidth: 640, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', fontFamily: '"DM Sans", sans-serif', marginBottom: 24, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back
        </button>

        <div style={{ background: '#fff', borderRadius: 16, padding: 40, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Post a New Project</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 300 }}>Fill in the details and start receiving bids from talented students.</p>
          </div>

          {error && <div style={{ padding: '12px 16px', borderRadius: 9, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FormField label="Project Title" hint="Be specific — e.g. 'Build a React portfolio website'">
              <input type="text" placeholder="What do you need done?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required style={inputStyle} />
            </FormField>

            <FormField label="Description" hint="Describe the work, deliverables, and any requirements">
              <textarea placeholder="Explain the project in detail..." rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormField label="Budget (₹)">
                <input type="number" placeholder="e.g. 3000" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} required style={inputStyle} min="1" />
              </FormField>
              <FormField label="Deadline">
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} required style={inputStyle} min={new Date().toISOString().split('T')[0]} />
              </FormField>
            </div>

            <FormField label="Skills / Tags" hint="Comma-separated — e.g. React, Node.js, Figma">
              <input type="text" placeholder="React, Python, UI Design..." value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={inputStyle} />
            </FormField>

            <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
              <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '12px', border: '1px solid var(--border)', borderRadius: 10, background: 'transparent', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: loading ? '#A5B4FC' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 14px rgba(79,70,229,0.25)' }}>
                {loading ? 'Posting...' : 'Post Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, fontWeight: 300 }}>{hint}</p>}
    </div>
  );
}