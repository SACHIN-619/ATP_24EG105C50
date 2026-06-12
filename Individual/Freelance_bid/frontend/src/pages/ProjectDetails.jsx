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
  const [reviewModal, setReviewModal] = useState(null);

  const load = () =>
    api.get(`/projects/${id}`)
      .then(r => setData(r.data))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  const acceptBid = async (bidId) => {
    await api.put(`/projects/${id}/bids/${bidId}/accept`);
    load();
  };

  const markComplete = async () => {
    await api.put(`/projects/${id}/complete`);
    load();
  };

  /* ── Loading & error states ── */
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

  /* ── Skill Matching Logic ── */
  const matchScore = (() => {
    if (!user || user.role !== 'student' || !user.skills?.length) return null;
    const projectTags = project.tags.map(t => t.toLowerCase());
    const userSkills = user.skills.map(s => s.toLowerCase());
    const matched = userSkills.filter(s => projectTags.some(t => t.includes(s) || s.includes(t)));
    return {
      score: Math.round((matched.length / projectTags.length) * 100),
      matched,
      missing: project.tags.filter(t => !userSkills.some(s => s.includes(t.toLowerCase()) || t.toLowerCase().includes(s))),
    };
  })();

  const isOwner = user && String(project.clientId?._id) === user._id;
  const myBid = user?.role === 'student' && bids.find(b => String(b.studentId?._id) === user._id);
  const acceptedBid = bids.find(b => b.status === 'accepted');

  const STATUS = {
    open: { label: 'Open for Bids', bg: '#ECFDF5', color: '#059669' },
    inProgress: { label: 'In Progress', bg: '#FFF7ED', color: '#C2410C' },
    completed: { label: 'Completed', bg: '#F3F4F6', color: '#6B7280' },
  };
  const s = STATUS[project.status];

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: 'var(--text-muted)',
          fontFamily: '"DM Sans", sans-serif', marginBottom: 24, padding: 0,
        }}>← Back to projects</button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Project header card */}
            <div className="fade-up" style={{
              background: '#fff', borderRadius: 16, padding: 32,
              border: '1px solid var(--border)', marginBottom: 24,
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {project.title}
                </h1>
                <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 100, flexShrink: 0 }}>
                  {s.label}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 7 }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Skill Match UI Component */}
              {matchScore !== null && (
                <div style={{
                  marginTop: 16, padding: '14px 18px',
                  background: matchScore.score >= 70 ? '#ECFDF5' : matchScore.score >= 40 ? '#FFF7ED' : '#FEF2F2',
                  border: `1px solid ${matchScore.score >= 70 ? '#86EFAC' : matchScore.score >= 40 ? '#FED7AA' : '#FECACA'}`,
                  borderRadius: 10,
                  marginBottom: 20
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      Your Skill Match
                    </span>
                    <span style={{
                      fontSize: 18, fontWeight: 700, fontFamily: '"Playfair Display", serif',
                      color: matchScore.score >= 70 ? '#059669' : matchScore.score >= 40 ? '#C2410C' : '#DC2626'
                    }}>
                      {matchScore.score}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{
                      height: '100%', borderRadius: 99, transition: 'width 0.4s',
                      width: `${matchScore.score}%`,
                      background: matchScore.score >= 70 ? '#10B981' : matchScore.score >= 40 ? '#F97316' : '#EF4444',
                    }} />
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {matchScore.matched.map(s => (
                      <span key={s} style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>✓ {s}</span>
                    ))}
                    {matchScore.missing.map(s => (
                      <span key={s} style={{ fontSize: 11, color: '#DC2626', fontWeight: 500 }}>✗ {s}</span>
                    ))}
                  </div>
                </div>
              )}

              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, fontWeight: 300 }}>
                {project.description}
              </p>

              {/* ── Mark as Completed button ── */}
              {isOwner && project.status === 'inProgress' && acceptedBid && (
                <button onClick={markComplete} style={{
                  marginTop: 20, padding: '9px 20px',
                  background: '#ECFDF5', color: '#059669',
                  border: '1px solid #86EFAC', borderRadius: 9,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: '"DM Sans", sans-serif',
                }}>
                  ✓ Mark Project as Completed
                </button>
              )}
            </div>

            {/* ── Bids / Proposals section ── */}
            <div className="fade-up fade-up-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Proposals ({bids.length})
                </h2>

                {/* Student: submit bid button */}
                {user?.role === 'student' && project.status === 'open' && !myBid && (
                  <button onClick={() => navigate(`/projects/${id}/bid`)} style={{
                    padding: '9px 20px', background: 'var(--accent)', color: '#fff',
                    border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                    boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
                  }}>Submit Proposal</button>
                )}

                {/* Student: already bid indicator */}
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
                    const bs = {
                      pending: { bg: '#FFF7ED', col: '#C2410C' },
                      accepted: { bg: '#ECFDF5', col: '#059669' },
                      rejected: { bg: '#FEF2F2', col: '#DC2626' },
                    }[bid.status];

                    return (
                      <div key={bid._id} style={{
                        background: bid.status === 'accepted' ? '#F0FDF4' : '#fff',
                        borderRadius: 14, padding: 20,
                        border: `1px solid ${bid.status === 'accepted' ? '#86EFAC' : 'var(--border)'}`,
                        boxShadow: bid.status === 'accepted' ? '0 0 0 2px rgba(34,197,94,0.1)' : 'none',
                      }}>

                        {/* Bid header: avatar + name + amount + status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: '50%',
                              background: 'var(--accent)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
                            }}>
                              {bid.studentId?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                                {bid.studentId?.name}
                              </div>
                              {bid.studentId?.rating > 0 && (
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                  ⭐ {bid.studentId.rating.toFixed(1)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 600, color: 'var(--accent)' }}>
                                ₹{bid.amount.toLocaleString()}
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{bid.duration}</div>
                            </div>
                            <span style={{ background: bs.bg, color: bs.col, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>
                              {bid.status}
                            </span>
                          </div>
                        </div>

                        {/* Bid description */}
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 10px' }}>
                          {bid.description}
                        </p>

                        {/* Action row */}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>

                          {/* 1. Accept bid — client only */}
                          {isOwner && bid.status === 'pending' && project.status === 'open' && (
                            <button onClick={() => acceptBid(bid._id)} style={{
                              padding: '7px 18px', background: 'var(--accent)', color: '#fff',
                              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                              cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                            }}>Accept Proposal</button>
                          )}

                          {/* 2. Leave review — client only */}
                          {isOwner && project.status === 'completed' && bid.status === 'accepted' && (
                            <button onClick={() => setReviewModal({ studentId: bid.studentId._id, studentName: bid.studentId.name })} style={{
                              padding: '7px 16px', background: '#FFF7ED', color: '#C2410C',
                              border: '1px solid #FED7AA', borderRadius: 8,
                              fontSize: 13, fontWeight: 600, cursor: 'pointer',
                              fontFamily: '"DM Sans", sans-serif',
                            }}>⭐ Leave Review</button>
                          )}

                          {/* 3. View profile */}
                          <a
                            href={`/profile/${bid.studentId?._id}`}
                            onClick={e => e.stopPropagation()}
                            style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}
                          >
                            View Profile →
                          </a>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="fade-up fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Project details card */}
            <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)', margin: '0 0 16px' }}>
                Project Details
              </h3>
              {[
                { label: 'Budget', value: `₹${project.budget.toLocaleString()}` },
                { label: 'Deadline', value: new Date(project.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Proposals', value: `${bids.length} received` },
                { label: 'Posted', value: new Date(project.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--surface-3)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Client card */}
            <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                About the Client
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: 16 }}>
                  {project.clientId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{project.clientId?.name}</div>
                  {project.clientId?.rating > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>⭐ {project.clientId.rating.toFixed(1)} rating</div>
                  )}
                </div>
              </div>
            </div>

            {/* Milestone tracker link */}
            {(project.status === 'inProgress' || project.status === 'completed') && (
              <button onClick={() => navigate(`/projects/${id}/milestones`)} style={{
                width: '100%', padding: '12px',
                background: '#fff',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                🏁 View Milestone Tracker
              </button>
            )}

            {/* Student: sidebar CTA */}
            {user?.role === 'student' && project.status === 'open' && !myBid && (
              <button onClick={() => navigate(`/projects/${id}/bid`)} style={{
                width: '100%', padding: '13px', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
              }}>Submit Your Proposal →</button>
            )}

          </div>
        </div>
      </div>

      {/* Review modal */}
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