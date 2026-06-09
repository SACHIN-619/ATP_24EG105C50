// reusable filter component

import { useState } from 'react';

export default function FilterBar({ onFilter }) {
  const [search,    setSearch]    = useState('');
  const [tag,       setTag]       = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [status,    setStatus]    = useState('open');

  const TAGS = ['React', 'Node.js', 'Python', 'Figma', 'MongoDB', 'Vue', 'Flutter', 'UI/UX', 'WordPress', 'Django'];

  const apply = () => onFilter({ search, tag, budgetMin, budgetMax, status });
  const reset = () => {
    setSearch(''); setTag(''); setBudgetMin(''); setBudgetMax(''); setStatus('open');
    onFilter({ search: '', tag: '', budgetMin: '', budgetMax: '', status: 'open' });
  };

  const inputStyle = {
    padding: '9px 14px', border: '1px solid var(--border)',
    borderRadius: 9, fontSize: 13, fontFamily: '"DM Sans", sans-serif',
    color: 'var(--text-primary)', background: 'var(--surface)',
    outline: 'none', width: '100%',
  };

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 14, padding: '20px 24px',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: 24,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px 120px 140px auto', gap: 10, alignItems: 'end', flexWrap: 'wrap' }}>

        {/* Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && apply()}
              placeholder="Search projects..."
              style={{ ...inputStyle, paddingLeft: 34 }}
            />
          </div>
        </div>

        {/* Tag */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill</label>
          <select value={tag} onChange={e => setTag(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">All Skills</option>
            {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Budget min */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min ₹</label>
          <input type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} placeholder="0" style={inputStyle} min="0" />
        </div>

        {/* Budget max */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max ₹</label>
          <input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="Any" style={inputStyle} min="0" />
        </div>

        {/* Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="open">Open</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={apply} style={{
            padding: '9px 18px', background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
            whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(79,70,229,0.2)',
          }}>Apply</button>
          <button onClick={reset} style={{
            padding: '9px 14px', background: 'var(--surface-3)', color: 'var(--text-secondary)',
            border: '1px solid var(--border)', borderRadius: 9, fontSize: 13,
            cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
          }}>Reset</button>
        </div>
      </div>

      {/* Quick tag chips */}
      <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Quick:</span>
        {TAGS.slice(0, 6).map(t => (
          <button key={t} onClick={() => { setTag(t); onFilter({ search, tag: t, budgetMin, budgetMax, status }); }} style={{
            padding: '3px 10px', borderRadius: 100,
            border: `1px solid ${tag === t ? 'var(--accent)' : 'var(--border)'}`,
            background: tag === t ? 'var(--accent-light)' : 'transparent',
            color: tag === t ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: 11, fontWeight: 500, cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif', transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>
    </div>
  );
}