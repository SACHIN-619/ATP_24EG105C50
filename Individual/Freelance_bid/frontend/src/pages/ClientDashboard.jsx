import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS = {
  open: { label: 'Open', bg: '#ECFDF5', color: '#059669' },
  inProgress: { label: 'In Progress', bg: '#FFF7ED', color: '#C2410C' },
  completed: { label: 'Completed', bg: '#F3F4F6', color: '#6B7280' },
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'client') { navigate('/login'); return; }
    api.get('/projects/mine').then(r => setProjects(r.data)).finally(() => setLoading(false));
  }, [user]);

  const filtered = tab === 'all' ? projects : projects.filter(p => p.status === tab);
  const counts = {
    all: projects.length,
    open: projects.filter(p => p.status === 'open').length,
    inProgress: projects.filter(p => p.status === 'inProgress').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Client Dashboard</p>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 600, color: 'var(--text-primary)' }}>
              Good day, {user?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          <button onClick={() => navigate('/client/projects/new')} style={{
            padding: '11px 24px',
            background: 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif',
            boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.target.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.target.style.background = 'var(--accent)'}
          >
            + Post New Project
          </button>
        </div>

        {/* Stat cards */}
        <div className="fade-up fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Projects', value: counts.all, icon: '◈' },
            { label: 'Open', value: counts.open, icon: '◯' },
            { label: 'In Progress', value: counts.inProgress, icon: '◐' },
            { label: 'Completed', value: counts.completed, icon: '◉' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{
              background: '#fff', borderRadius: 14, padding: '20px 24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: 20, marginBottom: 8, color: 'var(--accent)' }}>{icon}</div>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="fade-up fade-up-2" style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', borderRadius: 10, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '7px 16px', borderRadius: 7, border: 'none',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              background: tab === key ? 'var(--accent)' : 'transparent',
              color: tab === key ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s',
              textTransform: key === 'inProgress' ? 'none' : 'capitalize',
            }}>
              {key === 'inProgress' ? 'In Progress' : key} ({count})
            </button>
          ))}
        </div>

        {/* Projects list */}
        <div className="fade-up fade-up-3">
          {loading ? (
            <LoadingSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No projects yet"
              desc="Post your first project to start receiving bids from talented students."
              action="Post a Project"
              onAction={() => navigate('/client/projects/new')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(p => (
                <div key={p._id}
                  onClick={() => navigate(`/projects/${p._id}`)}
                  style={{
                    background: '#fff', borderRadius: 14, padding: '20px 24px',
                    border: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', transition: 'all 0.15s', gap: 16,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{p.title}</h3>
                      <StatusBadge status={p.status} />
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.description}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.tags.slice(0, 4).map(tag => (
                        <span key={tag} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 6 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>₹{p.budget.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Due {new Date(p.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                   
                    {(p.status === 'inProgress' || p.status === 'completed') && (
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/projects/${p._id}/milestones`); }}
                        style={{
                          marginTop: 8, padding: '4px 12px',
                          background: 'var(--accent-light)', color: 'var(--accent)',
                          border: '1px solid var(--accent)', borderRadius: 6,
                          fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          fontFamily: '"DM Sans", sans-serif',
                        }}
                      >🏁 Milestones</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.open;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 100 }}>
      {s.label}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid var(--border)', height: 88 }}>
          <div style={{ height: 14, width: '35%', background: 'var(--surface-3)', borderRadius: 6, marginBottom: 10 }} />
          <div style={{ height: 11, width: '60%', background: 'var(--surface-3)', borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, desc, action, onAction }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16, border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 300 }}>{desc}</p>
      {action && (
        <button onClick={onAction} style={{
          padding: '10px 24px', background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
        }}>{action}</button>
      )}
    </div>
  );
}