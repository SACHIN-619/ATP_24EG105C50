import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams({ status: 'open' });
    if (tagFilter) params.append('tag', tagFilter);
    api.get(`/projects?${params}`).then(r => setProjects(r.data)).finally(() => setLoading(false));
  }, [tagFilter]);

  const allTags = [...new Set(projects.flatMap(p => p.tags))];
  const filtered = search
    ? projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    : projects;

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Marketplace</p>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
            Open Projects
          </h1>
          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }}>🔍</span>
              <input type="text" placeholder="Search projects or skills..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid var(--border)', borderRadius: 9, fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', background: '#fff', color: 'var(--text-primary)' }}
              />
            </div>
            <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}
              style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 9, fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', background: '#fff', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <option value="">All Skills</option>
              {allTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ background: '#fff', borderRadius: 14, height: 180, border: '1px solid var(--border)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🪹</div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, color: 'var(--text-primary)', marginBottom: 8 }}>No projects found</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 300 }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, fontWeight: 500 }}>{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {filtered.map((p, i) => (
                <div key={p._id} className={`fade-up fade-up-${(i % 4) + 1}`}
                  onClick={() => navigate(`/projects/${p._id}`)}
                  style={{
                    background: '#fff', borderRadius: 14, padding: 24,
                    border: '1px solid var(--border)', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    transition: 'all 0.15s', minHeight: 200,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.description}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      {p.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 6 }}>{tag}</span>
                      ))}
                      {p.tags.length > 3 && <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '3px 0' }}>+{p.tags.length - 3}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>₹{p.budget.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        Due {new Date(p.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{p.clientId?.name}</div>
                      {p.clientId?.rating > 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>⭐ {p.clientId.rating.toFixed(1)}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}