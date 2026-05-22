import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function BidForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: '', duration: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await api.post(`/projects/${id}/bids`, { ...form, amount: Number(form.amount) });
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal');
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 9, fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: 'var(--text-primary)', background: '#fff', outline: 'none' };

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh', padding: '48px 24px' }}>
      <div className="fade-up" style={{ maxWidth: 600, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', fontFamily: '"DM Sans", sans-serif', marginBottom: 24, padding: 0 }}>
          ← Back to project
        </button>
        <div style={{ background: '#fff', borderRadius: 16, padding: 40, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Submit Your Proposal</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 300 }}>Make a compelling case for why you're the right fit.</p>
          </div>

          {error && <div style={{ padding: '12px 16px', borderRadius: 9, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Your Bid Amount (₹)</label>
                <input type="number" placeholder="e.g. 2500" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required style={inputStyle} min="1" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Estimated Duration</label>
                <input type="text" placeholder="e.g. 3 days, 1 week" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} required style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Cover Letter / Proposal</label>
              <textarea placeholder="Describe your approach, relevant experience, and why you're the best fit for this project..." rows={6} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, fontWeight: 300 }}>Tip: Mention relevant past work and how you'll approach this specific project.</p>
            </div>

            <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
              <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '12px', border: '1px solid var(--border)', borderRadius: 10, background: 'transparent', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: loading ? '#A5B4FC' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 14px rgba(79,70,229,0.25)' }}>
                {loading ? 'Submitting...' : 'Submit Proposal →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}