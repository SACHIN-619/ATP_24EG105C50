import { useState } from 'react';
import api from '../api/axios';

export default function ReviewModal({ projectId, studentId, studentName, onClose, onSuccess }) {
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/users/reviews', { projectId, studentId, rating, comment });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15,15,16,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      backdropFilter: 'blur(4px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade-up" style={{
        background: '#fff', borderRadius: 16, padding: 36,
        width: '100%', maxWidth: 460,
        boxShadow: 'var(--shadow-lg)',
      }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          Leave a Review
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 300 }}>
          Share your experience working with <strong style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{studentName}</strong>
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Star selector */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 10 }}>Rating</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 32, padding: '2px 4px',
                    color: n <= (hover || rating) ? '#F59E0B' : '#E5E7EB',
                    transition: 'color 0.1s, transform 0.1s',
                    transform: n <= (hover || rating) ? 'scale(1.15)' : 'scale(1)',
                  }}>★</button>
              ))}
            </div>
            {rating > 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Comment</label>
            <textarea rows={4} placeholder="Share your experience — quality of work, communication, timeliness..." value={comment} onChange={e => setComment(e.target.value)} required style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 9, fontSize: 14, fontFamily: '"DM Sans", sans-serif', resize: 'none', outline: 'none', lineHeight: 1.7 }} />
          </div>

          {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px', border: '1px solid var(--border)', borderRadius: 9, background: 'transparent', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '11px', background: loading ? '#A5B4FC' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 12px rgba(79,70,229,0.25)' }}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}