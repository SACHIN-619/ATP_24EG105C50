import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';


export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => api.get(`/projects/${id}`).then(r => setData(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);

  const acceptBid = async (bidId) => {
    await api.put(`/projects/${id}/bids/${bidId}/accept`);
    load();
  };

  const [reviewModal, setReviewModal] = useState(null);
  // reviewModal = { studentId, studentName } | null

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading project...</div>
    </div>
  );
  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
        <p style={{ color: 'var(--text-muted)' }}>Project not found</p>
      </div>
    </div>
  );

  const { project, bids } = data;
  const isOwner = user && String(project.clientId?._id) === user._id;
  const myBid = user?.role === 'student' && bids.find(b => String(b.studentId?._id) === user._id);

  const STATUS = {
    open: { label: 'Open for Bids', bg: '#ECFDF5', color: '#059669' },
    inProgress: { label: 'In Progress', bg: '#FFF7ED', color: '#C2410C' },
    completed: { label: 'Completed', bg: '#F3F4F6', color: '#6B7280' },
  };
  const s = STATUS[project.status];

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', fontFamily: '"DM Sans", sans-serif', marginBottom: 24, padding: 0 }}>
          ← Back to projects
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Main */}
          <div>
            <div className="fade-up" style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid var(--border)', marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{project.title}</h1>
                <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 100, flexShrink: 0 }}>{s.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 7 }}>{tag}</span>
                ))}
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, fontWeight: 300 }}>{project.description}</p>
            </div>

            {/* Bids section */}
            <div className="fade-up fade-up-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Proposals ({bids.length})
                </h2>
                {user?.role === 'student' && project.status === 'open' && !myBid && (
                  <button onClick={() => navigate(`/projects/${id}/bid`)} style={{
                    padding: '9px 20px', background: 'var(--accent)', color: '#fff',
                    border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                    boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
                  }}>Submit Proposal</button>
                )}
                {myBid && (
                  <span style={{ fontSize: 13, color: '#059669', fontWeight: 500, background: '#ECFDF5', padding: '6px 14px', borderRadius: 8 }}>
                    ✓ You've submitted a proposal
                  </span>
                )}
              </div>

              {bids.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 14, padding: 32, border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  No proposals yet. Be the first to bid!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {bids.map(bid => {
                    const bs = { pending: { bg: '#FFF7ED', col: '#C2410C' }, accepted: { bg: '#ECFDF5', col: '#059669' }, rejected: { bg: '#FEF2F2', col: '#DC2626' } }[bid.status];
                    return (
                      <div key={bid._id} style={{
                        background: bid.status === 'accepted' ? '#F0FDF4' : '#fff',
                        borderRadius: 14, padding: 20,
                        border: `1px solid ${bid.status === 'accepted' ? '#86EFAC' : 'var(--border)'}`,
                        boxShadow: bid.status === 'accepted' ? '0 0 0 2px rgba(34,197,94,0.1)' : 'none',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                              {bid.studentId?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{bid.studentId?.name}</div>
                              {bid.studentId?.rating > 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>⭐ {bid.studentId.rating.toFixed(1)}</div>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 600, color: 'var(--accent)' }}>₹{bid.amount.toLocaleString()}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{bid.duration}</div>
                            </div>
                            <span style={{ background: bs.bg, color: bs.col, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>
                              {bid.status}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{bid.description}</p>
                        {isOwner && bid.status === 'pending' && (
                          <button onClick={() => acceptBid(bid._id)} style={{
                            marginTop: 12, padding: '7px 18px',
                            background: 'var(--accent)', color: '#fff',
                            border: 'none', borderRadius: 8, fontSize: 13,
                            fontWeight: 600, cursor: 'pointer',
                            fontFamily: '"DM Sans", sans-serif',
                          }}>Accept Proposal</button>
                        )}
                        {/* Complete project button — show if inProgress and owner */}
                        {isOwner && project.status === 'inProgress' && (
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                            {/* Mark complete */}
                            {bids.find(b => b.status === 'accepted') && (
                              <button onClick={async () => {
                                await api.put(`/projects/${id}/complete`);
                                load();
                              }} style={{
                                padding: '7px 16px', background: '#ECFDF5',
                                color: '#059669', border: '1px solid #86EFAC',
                                borderRadius: 8, fontSize: 13, fontWeight: 600,
                                cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                              }}>Mark as Completed</button>
                            )}
                          </div>
                        )}

                        {/* Leave review — show for completed project, accepted bid, owner */}
                        {isOwner && project.status === 'completed' && bid.status === 'accepted' && (
                          <button onClick={() => setReviewModal({ studentId: bid.studentId._id, studentName: bid.studentId.name })} style={{
                            marginTop: 10, padding: '7px 16px',
                            background: '#FFF7ED', color: '#C2410C',
                            border: '1px solid #FED7AA',
                            borderRadius: 8, fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                          }}>⭐ Leave Review</button>
                        )}

                        {/* View profile link on bid card */}
                        <a href={`/profile/${bid.studentId?._id}`} onClick={e => { e.stopPropagation(); }} style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>
                          View Profile →
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="fade-up fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Project Details</h3>
              {[
                { label: 'Budget', value: `₹${project.budget.toLocaleString()}` },
                { label: 'Deadline', value: new Date(project.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Proposals', value: `${bids.length} received` },
                { label: 'Posted', value: new Date(project.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--surface-3)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>About the Client</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: 16 }}>
                  {project.clientId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{project.clientId?.name}</div>
                  {project.clientId?.rating > 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>⭐ {project.clientId.rating.toFixed(1)} rating</div>}
                </div>
              </div>
            </div>

            {user?.role === 'student' && project.status === 'open' && !myBid && (
              <button onClick={() => navigate(`/projects/${id}/bid`)} style={{
                width: '100%', padding: '13px',
                background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif',
                boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
              }}>Submit Your Proposal →</button>
            )}
          </div>
        </div>
      </div>
      {reviewModal && (
        <ReviewModal
          projectId={id}
          studentId={reviewModal.studentId}
          studentName={reviewModal.studentName}
          onClose={() => setReviewModal(null)}
          onSuccess={load}
        />
      )}
    </div>
  );
}