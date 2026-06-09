import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FilterBar from '../components/FilterBar';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const navigate = useNavigate();

  const fetchProjects = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status)    params.append('status',    filters.status);
      if (filters.tag)       params.append('tag',       filters.tag);
      if (filters.budgetMin) params.append('budgetMin', filters.budgetMin);
      if (filters.budgetMax) params.append('budgetMax', filters.budgetMax);

      const { data } = await api.get(`/projects?${params}`);

      // Client-side search (title/description match)
      const search = filters.search?.toLowerCase() || '';
      const filtered = search
        ? data.filter(p =>
            p.title.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.tags.some(t => t.toLowerCase().includes(search))
          )
        : data;

      setProjects(filtered);
      setTotal(filtered.length);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProjects({ status: 'open' }); }, []);

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 24px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Marketplace</p>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Find Projects
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        <FilterBar onFilter={fetchProjects} />

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: 14, height: 200, border: '1px solid var(--border)', opacity: 0.5 }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🪹</div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, color: 'var(--text-primary)', marginBottom: 8 }}>No projects found</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 300 }}>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18, fontWeight: 500 }}>
              {total} project{total !== 1 ? 's' : ''} found
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {projects.map((p, i) => (
                <div key={p._id} className={`fade-up fade-up-${(i % 4) + 1}`}
                  onClick={() => navigate(`/projects/${p._id}`)}
                  style={{
                    background: 'var(--surface)', borderRadius: 14, padding: 24,
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