import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/users/leaderboard')
      .then(r => setStudents(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '48px 24px 56px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 36, fontWeight: 600, color: '#fff', margin: '0 0 8px' }}>
            Campus Leaderboard
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: 300 }}>
            Top student freelancers ranked by virtual earnings, projects, and ratings
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '-24px auto 0', padding: '0 24px 48px' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 40 }}>Loading...</p>
        ) : students.length === 0 ? (
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 48, textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No students have completed projects yet. Be the first!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {students.map((s, i) => (
              <div key={s._id} className={`fade-up fade-up-${(i % 4) + 1}`}
                onClick={() => navigate(`/profile/${s._id}`)}
                style={{
                  background: i < 3 ? 'var(--surface)' : 'var(--surface)',
                  borderRadius: 14, padding: '18px 24px',
                  border: `1px solid ${i === 0 ? '#FCD34D' : i === 1 ? '#D1D5DB' : i === 2 ? '#FCA67A' : 'var(--border)'}`,
                  boxShadow: i < 3 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                {/* Rank */}
                <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                  {i < 3 ? (
                    <span style={{ fontSize: 28 }}>{MEDALS[i]}</span>
                  ) : (
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-muted)', fontFamily: '"Playfair Display", serif' }}>#{i + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: `hsl(${(i * 47) % 360}, 60%, 55%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 16,
                  fontFamily: '"Playfair Display", serif',
                }}>{s.name.charAt(0).toUpperCase()}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                    {s.verifiedSkills.length > 0 && (
                      <span style={{ fontSize: 11, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>
                        ⚡ {s.verifiedSkills.length} badge{s.verifiedSkills.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    {s.skills?.slice(0, 3).map(skill => (
                      <span key={skill} style={{ fontSize: 11, background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 20, flexShrink: 0, textAlign: 'center' }}>
                  <div>
                    <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, color: 'var(--accent)' }}>₹{s.earned.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>earned</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{s.projectsDone}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>projects</div>
                  </div>
                  {s.rating > 0 && (
                    <div>
                      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, color: '#F59E0B' }}>⭐ {s.rating.toFixed(1)}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>rating</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}