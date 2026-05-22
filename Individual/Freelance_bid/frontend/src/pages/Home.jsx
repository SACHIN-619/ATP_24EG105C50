import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '◈', title: 'Post Projects', desc: 'Clients post tasks with budgets, deadlines, and tags in under 2 minutes.' },
  { icon: '◇', title: 'Bid & Win', desc: 'Students submit tailored proposals and compete on skill, not just price.' },
  { icon: '◉', title: 'Track Milestones', desc: 'Break work into milestones. Approve progress. Release virtual payments.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ background: 'var(--surface)' }}>

      {/* Hero */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '96px 24px 80px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        alignItems: 'center',
      }}>
        <div className="fade-up">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'var(--accent-light)',
            borderRadius: 100,
            marginBottom: 24,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Student Freelance Marketplace
            </span>
          </div>

          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            marginBottom: 20,
            letterSpacing: '-1px',
          }}>
            Where campus talent<br />
            meets real <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>opportunity.</em>
          </h1>

          <p style={{
            fontSize: 17,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 36,
            maxWidth: 440,
            fontWeight: 300,
          }}>
            Post projects, submit bids, and track milestone-based payments — all within your university ecosystem.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {user ? (
              <PrimaryBtn onClick={() => navigate(user.role === 'client' ? '/client/dashboard' : '/student/dashboard')}>
                Go to Dashboard →
              </PrimaryBtn>
            ) : (
              <>
                <PrimaryBtn onClick={() => navigate('/signup?role=client')}>
                  Post a Project
                </PrimaryBtn>
                <SecondaryBtn onClick={() => navigate('/signup?role=student')}>
                  Find Work
                </SecondaryBtn>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
            {[['500+', 'Students'], ['200+', 'Projects'], ['98%', 'Satisfaction']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', fontFamily: '"Playfair Display", serif' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.03em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="fade-up fade-up-2" style={{ position: 'relative' }}>
          <div style={{
            background: 'linear-gradient(135deg, #F0F0FF 0%, #E8E8FF 50%, #F5F3FF 100%)',
            borderRadius: 24,
            padding: 32,
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(79,70,229,0.08)',
          }}>
            {/* Mock project card */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: 'var(--shadow-sm)', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Build a React Dashboard</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Posted 2 hours ago</div>
                </div>
                <span style={{ background: '#ECFDF5', color: '#059669', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>Open</span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {['React', 'Tailwind', 'Node.js'].map(t => (
                  <span key={t} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 6 }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', fontFamily: '"Playfair Display", serif' }}>₹4,500</span>
                <div style={{ display: 'flex', gap: -6 }}>
                  {['A','B','C'].map((l,i) => (
                    <div key={l} style={{ width: 24, height: 24, borderRadius: '50%', background: ['#4F46E5','#7C3AED','#EC4899'][i], border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700, marginLeft: i > 0 ? -6 : 0 }}>{l}</div>
                  ))}
                  <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>3 bids</span>
                </div>
              </div>
            </div>

            {/* Mock bid */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>S</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Sneha R. placed a bid</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>₹3,800 · 5 days · ⭐ 4.9</div>
              </div>
              <span style={{ background: '#FFF7ED', color: '#C2410C', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>Pending</span>
            </div>
          </div>

          {/* Floating badge */}
          <div style={{
            position: 'absolute', bottom: -16, left: -16,
            background: '#fff',
            borderRadius: 12, padding: '10px 16px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>24 projects live now</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: 1, background: 'var(--border)' }} />
      </div>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 36, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
            Everything you need to succeed
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 300 }}>
            A complete ecosystem for student freelancing — built for your campus.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {features.map((f, i) => (
            <div key={f.title} className={`fade-up fade-up-${i + 1}`} style={{
              padding: 32,
              border: '1px solid var(--border)',
              borderRadius: 16,
              background: '#fff',
              transition: 'all 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 16, color: 'var(--accent)' }}>{f.icon}</div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        maxWidth: 1100, margin: '0 auto 80px',
        padding: '0 24px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, #7C3AED 100%)',
          borderRadius: 24,
          padding: '56px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 32,
          flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
              Ready to get started?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: 300 }}>
              Join hundreds of students already building their portfolios.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/signup?role=client')} style={{
              padding: '12px 28px', borderRadius: 10, border: 'none',
              background: '#fff', color: 'var(--accent)', fontWeight: 600,
              fontSize: 14, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.9'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >Post a Project</button>
            <button onClick={() => navigate('/projects')} style={{
              padding: '12px 28px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'transparent', color: '#fff', fontWeight: 500,
              fontSize: 14, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >Browse Projects</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PrimaryBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 28px',
      background: 'var(--accent)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: '"DM Sans", sans-serif',
      transition: 'background 0.15s',
      boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
    }}
      onMouseEnter={e => e.target.style.background = 'var(--accent-hover)'}
      onMouseLeave={e => e.target.style.background = 'var(--accent)'}
    >{children}</button>
  );
}

function SecondaryBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 28px',
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer',
      fontFamily: '"DM Sans", sans-serif',
      transition: 'all 0.15s',
    }}
      onMouseEnter={e => { e.target.style.background = 'var(--surface-3)'; e.target.style.borderColor = 'var(--border-hover)'; }}
      onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'var(--border)'; }}
    >{children}</button>
  );
}