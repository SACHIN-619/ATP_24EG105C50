import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BID_STATUS = {
  pending: { label: 'Pending', bg: '#FFF7ED', color: '#C2410C' },
  accepted: { label: 'Accepted', bg: '#ECFDF5', color: '#059669' },
  rejected: { label: 'Rejected', bg: '#FEF2F2', color: '#DC2626' },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'student') { navigate('/login'); return; }
    api.get('/bids/me').then(r => setBids(r.data)).finally(() => setLoading(false));
  }, [user]);

  const filtered = filter === 'all' ? bids : bids.filter(b => b.status === filter);
  const stats = { all: bids.length, pending: bids.filter(b => b.status === 'pending').length, accepted: bids.filter(b => b.status === 'accepted').length, rejected: bids.filter(b => b.status === 'rejected').length };

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Student Dashboard</p>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 600, color: 'var(--text-primary)' }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          <button onClick={() => navigate('/projects')} style={{
            padding: '11px 24px', background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
            boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
          }}>Browse Projects →</button>
        </div>

        {/* Stats */}
        <div className="fade-up fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Bids', value: stats.all, icon: '◈', col: 'var(--accent)' },
            { label: 'Pending', value: stats.pending, icon: '◐', col: '#C2410C' },
            { label: 'Accepted', value: stats.accepted, icon: '◉', col: '#059669' },
            { label: 'Rejected', value: stats.rejected, icon: '✕', col: '#DC2626' },
          ].map(({ label, value, icon, col }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: 18, marginBottom: 8, color: col }}>{icon}</div>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="fade-up fade-up-2" style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', borderRadius: 10, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
          {['all', 'pending', 'accepted', 'rejected'].map(key => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: '7px 16px', borderRadius: 7, border: 'none',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif', textTransform: 'capitalize',
              background: filter === key ? 'var(--accent)' : 'transparent',
              color: filter === key ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>{key} ({stats[key]})</button>
          ))}
        </div>

        {/* Bids list */}
        <div className="fade-up fade-up-3">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ background: '#fff', borderRadius: 14, height: 88, border: '1px solid var(--border)' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>No bids yet</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 300 }}>Find a project that matches your skills and submit your first bid.</p>
              <button onClick={() => navigate('/projects')} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>Browse Projects</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(bid => {
                const s = BID_STATUS[bid.status];
                return (
                  <div key={bid._id}
                    onClick={() => navigate(`/projects/${bid.projectId?._id}`)}
                    style={{
                      background: '#fff', borderRadius: 14, padding: '20px 24px',
                      border: '1px solid var(--border)', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {bid.projectId?.title || 'Project'}
                        </h3>
                        <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 100, flexShrink: 0 }}>{s.label}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bid.description}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>₹{bid.amount?.toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{bid.duration}</div>
                     
                      {bid.status === 'accepted' && (
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/projects/${bid.projectId?._id}/milestones`); }}
                          style={{
                            marginTop: 8, padding: '4px 12px',
                            background: 'var(--accent-light)', color: 'var(--accent)',
                            border: '1px solid var(--accent)', borderRadius: 6,
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            fontFamily: '"DM Sans", sans-serif',
                          }}
                        >🏁 View Milestones</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}