import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TABS = ['Overview', 'Portfolio', 'Reviews'];

export default function Profile() {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [profile, setProfile]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [tab, setTab]           = useState('Overview');
  const [loading, setLoading]   = useState(true);

  const isOwn = user?._id === id;

  useEffect(() => {
    Promise.all([
      api.get(`/users/${id}`),
      api.get(`/users/${id}/reviews`),
    ]).then(([p, r]) => {
      setProfile(p.data);
      setReviews(r.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!profile) return <NotFound />;

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        height: 180,
        position: 'relative',
      }}>
        {/* Decorative pattern */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} viewBox="0 0 800 180" preserveAspectRatio="none">
          {Array.from({ length: 8 }).map((_, i) =>
            <circle key={i} cx={100 * i + 50} cy={90} r={60 + i * 10} fill="none" stroke="white" strokeWidth="1"/>
          )}
        </svg>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>

        {/* Profile header card */}
        <div className="fade-up" style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px 32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          marginTop: -60,
          marginBottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 20,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            {/* Avatar */}
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 32, fontWeight: 700,
              border: '4px solid #fff',
              boxShadow: 'var(--shadow-md)',
              flexShrink: 0,
              fontFamily: '"Playfair Display", serif',
              marginTop: -20,
            }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <h1 style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 26, fontWeight: 600,
                color: 'var(--text-primary)', margin: '0 0 4px',
              }}>{profile.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{
                  background: profile.role === 'student' ? 'var(--accent-light)' : '#FFF7ED',
                  color: profile.role === 'student' ? 'var(--accent)' : '#C2410C',
                  fontSize: 12, fontWeight: 600,
                  padding: '2px 10px', borderRadius: 100,
                  textTransform: 'capitalize',
                }}>
                  {profile.role === 'student' ? '🎓 Student' : '🏢 Client'}
                </span>
                {profile.rating > 0 && (
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarRating rating={profile.rating} />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{profile.rating.toFixed(1)}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({reviews.length} reviews)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {isOwn && (
            <button onClick={() => navigate('/profile/edit')} style={{
              padding: '9px 20px',
              border: '1px solid var(--border)',
              borderRadius: 9, background: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              color: 'var(--text-primary)',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="fade-up fade-up-1" style={{
          display: 'flex', gap: 4, marginBottom: 24,
          background: '#fff', borderRadius: 10, padding: 4,
          border: '1px solid var(--border)', width: 'fit-content',
        }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 20px', borderRadius: 7, border: 'none',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              background: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        <div className="fade-up fade-up-2">
          {tab === 'Overview'   && <OverviewTab  profile={profile} reviews={reviews} />}
          {tab === 'Portfolio'  && <PortfolioTab portfolio={profile.portfolio || []} isOwn={isOwn} navigate={navigate} />}
          {tab === 'Reviews'    && <ReviewsTab   reviews={reviews} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ profile, reviews }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start', paddingBottom: 48 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Bio */}
        <Card title="About">
          {profile.bio ? (
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{profile.bio}</p>
          ) : (
            <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No bio added yet.</p>
          )}
        </Card>

        {/* Skills */}
        {profile.role === 'student' && (
          <Card title="Skills">
            {profile.skills?.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.skills.map(skill => (
                  <span key={skill} style={{
                    background: 'var(--accent-light)', color: 'var(--accent)',
                    padding: '5px 14px', borderRadius: 8,
                    fontSize: 13, fontWeight: 500,
                  }}>{skill}</span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No skills added yet.</p>
            )}
          </Card>
        )}

        {/* Recent reviews preview */}
        {reviews.length > 0 && (
          <Card title="Recent Reviews">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.slice(0, 2).map(r => (
                <ReviewItem key={r._id} review={r} />
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: 24,
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)', margin: '0 0 16px' }}>
            At a Glance
          </h3>
          {[
            { label: 'Role',        value: profile.role === 'student' ? 'Student Freelancer' : 'Client' },
            { label: 'Rating',      value: profile.rating > 0 ? `⭐ ${profile.rating.toFixed(1)} / 5` : 'No ratings yet' },
            { label: 'Reviews',     value: `${reviews.length} received` },
            { label: 'Skills',      value: profile.skills?.length > 0 ? `${profile.skills.length} listed` : 'None yet' },
            { label: 'Portfolio',   value: profile.portfolio?.length > 0 ? `${profile.portfolio.length} projects` : 'Empty' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--surface-3)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Portfolio Tab ─── */
function PortfolioTab({ portfolio, isOwn, navigate }) {
  return (
    <div style={{ paddingBottom: 48 }}>
      {portfolio.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗂️</div>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>No portfolio items yet</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 300, marginBottom: 24 }}>
            {isOwn ? 'Add your best work to showcase your skills.' : 'This student hasn\'t added portfolio items yet.'}
          </p>
          {isOwn && (
            <button onClick={() => navigate('/profile/edit')} style={{
              padding: '10px 24px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
            }}>Add Portfolio Item</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {portfolio.map((item, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {/* Placeholder visual */}
              <div style={{
                height: 140,
                background: `linear-gradient(135deg, hsl(${(i * 47) % 360}, 60%, 88%) 0%, hsl(${(i * 47 + 60) % 360}, 60%, 82%) 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40,
              }}>
                {['◈', '◇', '◉', '△', '◐'][i % 5]}
              </div>
              <div style={{ padding: '18px 20px' }}>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {item.tags?.map(tag => (
                    <span key={tag} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 6 }}>{tag}</span>
                  ))}
                </div>
                {item.projectUrl && (
                  <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 12, color: 'var(--accent)', fontWeight: 600,
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    View Project →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Reviews Tab ─── */
function ReviewsTab({ reviews }) {
  return (
    <div style={{ paddingBottom: 48 }}>
      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>No reviews yet</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 300 }}>Reviews appear here after completing projects.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reviews.map(r => <ReviewItem key={r._id} review={r} full />)}
        </div>
      )}
    </div>
  );
}

/* ─── Shared components ─── */
function Card({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '24px 28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>{title}</h3>
      {children}
    </div>
  );
}

function ReviewItem({ review, full }) {
  return (
    <div style={{ background: full ? '#fff' : 'var(--surface-2)', borderRadius: 12, padding: full ? '20px 24px' : '16px', border: full ? '1px solid var(--border)' : 'none', boxShadow: full ? 'var(--shadow-sm)' : 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
            {review.clientId?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{review.clientId?.name}</div>
            {review.projectId?.title && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>on "{review.projectId.title}"</div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <StarRating rating={review.rating} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{review.comment}</p>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ fontSize: 13, color: n <= Math.round(rating) ? '#F59E0B' : '#E5E7EB' }}>★</span>
      ))}
    </div>
  );
}

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading profile...</div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>404</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>User not found</p>
      </div>
    </div>
  );
}