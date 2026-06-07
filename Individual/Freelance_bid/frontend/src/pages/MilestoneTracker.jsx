import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

/* ── Status config ── */
const STATUS = {
  pending:   { label: 'Pending',   bg: '#FFF7ED', color: '#C2410C', dot: '#F97316', step: 1 },
  completed: { label: 'Submitted', bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6', step: 2 },
  approved:  { label: 'Approved',  bg: '#ECFDF5', color: '#059669', dot: '#10B981', step: 3 },
  rejected:  { label: 'Rework',    bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444', step: 1 },
};

export default function MilestoneTracker() {
  const { id }       = useParams();          // projectId
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [project,    setProject]    = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [actionNote, setActionNote] = useState({ id: null, value: '' });

  const load = async () => {
    try {
      const [proj, miles] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/milestones`),
      ]);
      setProject(proj.data.project);
      setMilestones(miles.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (!user) navigate('/login'); else load(); }, [id]);

  /* ── Virtual payment stats ── */
  const totalBudget   = project?.budget || 0;
  const totalAllocated = milestones.reduce((s, m) => s + m.amount, 0);
  const totalPaid      = milestones.filter(m => m.status === 'approved').reduce((s, m) => s + m.amount, 0);
  const totalPending   = milestones.filter(m => m.status !== 'approved').reduce((s, m) => s + m.amount, 0);
  const remaining      = totalBudget - totalAllocated;
  const paidPercent    = totalBudget > 0 ? (totalPaid / totalBudget) * 100 : 0;

  const isClient  = user?.role === 'client';
  const isStudent = user?.role === 'student';

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>

        {/* Back + header */}
        <button onClick={() => navigate(`/projects/${id}`)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: 'var(--text-muted)',
          fontFamily: '"DM Sans", sans-serif', padding: 0, marginBottom: 24,
        }}>← Back to Project</button>

        <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
              Milestone Tracker
            </p>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {project?.title}
            </h1>
          </div>
          {isClient && project?.status === 'inProgress' && (
            <button onClick={() => setShowForm(v => !v)} style={{
              padding: '10px 22px', background: showForm ? 'var(--surface-3)' : 'var(--accent)',
              color: showForm ? 'var(--text-primary)' : '#fff',
              border: showForm ? '1px solid var(--border)' : 'none',
              borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
              boxShadow: showForm ? 'none' : '0 4px 14px rgba(79,70,229,0.25)',
              transition: 'all 0.15s',
            }}>
              {showForm ? '✕ Cancel' : '+ Add Milestone'}
            </button>
          )}
        </div>

        {/* Payment summary cards */}
        <div className="fade-up fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Project Budget',  value: `₹${totalBudget.toLocaleString()}`,     sub: 'total',           col: 'var(--accent)' },
            { label: 'Allocated',       value: `₹${totalAllocated.toLocaleString()}`,  sub: `${milestones.length} milestones`, col: '#7C3AED' },
            { label: 'Released',        value: `₹${totalPaid.toLocaleString()}`,       sub: 'virtually paid',  col: '#059669' },
            { label: 'Remaining',       value: `₹${remaining.toLocaleString()}`,       sub: 'unallocated',     col: remaining < 0 ? '#DC2626' : '#C2410C' },
          ].map(({ label, value, sub, col }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 600, color: col, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Payment progress bar */}
        {milestones.length > 0 && (
          <div className="fade-up fade-up-2" style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid var(--border)', marginBottom: 28, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Payment Progress</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{paidPercent.toFixed(0)}% released</span>
            </div>
            {/* Segmented bar */}
            <div style={{ height: 10, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
              {milestones.map((m, i) => {
                const w = totalBudget > 0 ? (m.amount / totalBudget) * 100 : 0;
                const bg = m.status === 'approved'  ? '#10B981'
                         : m.status === 'completed' ? '#3B82F6'
                         : m.status === 'rejected'  ? '#EF4444'
                         : '#E5E7EB';
                return (
                  <div key={m._id} title={`${m.title}: ₹${m.amount}`} style={{
                    width: `${w}%`, background: bg,
                    borderRight: i < milestones.length - 1 ? '2px solid #fff' : 'none',
                    transition: 'background 0.3s',
                  }} />
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
              {[
                { col: '#10B981', label: 'Approved' },
                { col: '#3B82F6', label: 'Submitted' },
                { col: '#F97316', label: 'Pending' },
                { col: '#EF4444', label: 'Rework' },
              ].map(({ col, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: col }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add milestone form */}
        {showForm && (
          <div className="fade-up" style={{ marginBottom: 28 }}>
            <AddMilestoneForm
              projectId={id}
              remaining={remaining}
              onSuccess={() => { setShowForm(false); load(); }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Timeline */}
        <div className="fade-up fade-up-3">
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
            Milestones ({milestones.length})
          </h2>

          {milestones.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 16, padding: '56px 24px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏁</div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>
                No milestones yet
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 300 }}>
                {isClient ? 'Break the project into milestones to track progress and release payments.' : 'The client hasn\'t added milestones yet.'}
              </p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute', left: 19, top: 24,
                width: 2, height: 'calc(100% - 48px)',
                background: 'linear-gradient(to bottom, var(--accent), #E5E7EB)',
                borderRadius: 2,
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {milestones.map((m, idx) => (
                  <MilestoneCard
                    key={m._id}
                    milestone={m}
                    index={idx}
                    isClient={isClient}
                    isStudent={isStudent}
                    actionNote={actionNote}
                    setActionNote={setActionNote}
                    onAction={load}
                    totalBudget={totalBudget}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ── Milestone Card ── */
function MilestoneCard({ milestone: m, index, isClient, isStudent, actionNote, setActionNote, onAction, totalBudget }) {
  const s = STATUS[m.status];
  const [busy, setBusy] = useState(false);
  const showNoteInput = actionNote.id === m._id;
  const pct = totalBudget > 0 ? ((m.amount / totalBudget) * 100).toFixed(1) : 0;

  const doAction = async (endpoint, method = 'put', body = {}) => {
    setBusy(true);
    try {
      await api[method](`/milestones/${m._id}/${endpoint}`, body);
      onAction();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
      {/* Timeline dot */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: m.status === 'approved' ? '#10B981' : m.status === 'completed' ? '#3B82F6' : m.status === 'rejected' ? '#EF4444' : '#fff',
        border: `2px solid ${s.dot}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, color: m.status === 'approved' || m.status === 'completed' || m.status === 'rejected' ? '#fff' : s.dot,
        zIndex: 1, position: 'relative',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.3s',
      }}>
        {m.status === 'approved' ? '✓' : m.status === 'rejected' ? '↺' : index + 1}
      </div>

      {/* Card */}
      <div style={{
        flex: 1, marginLeft: 16,
        background: '#fff', borderRadius: 14, padding: '20px 24px',
        border: `1px solid ${m.status === 'approved' ? '#86EFAC' : m.status === 'completed' ? '#BFDBFE' : m.status === 'rejected' ? '#FECACA' : 'var(--border)'}`,
        boxShadow: 'var(--shadow-sm)',
        transition: 'border-color 0.2s',
      }}>
        {/* Card header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {m.title}
              </h3>
              <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 100, flexShrink: 0 }}>
                {s.label}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                📅 Due {new Date(m.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {pct}% of budget
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 600, color: m.status === 'approved' ? '#059669' : 'var(--accent)' }}>
              ₹{m.amount.toLocaleString()}
            </div>
            {m.status === 'approved' && (
              <div style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>✓ Released</div>
            )}
          </div>
        </div>

        {/* Note */}
        {m.note && (
          <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 300, borderLeft: `3px solid ${s.dot}` }}>
            {m.note}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Student: mark as completed */}
          {isStudent && m.status === 'pending' && (
            <>
              {showNoteInput ? (
                <div style={{ display: 'flex', gap: 8, width: '100%', flexWrap: 'wrap' }}>
                  <input
                    placeholder="Add a note (optional)..."
                    value={actionNote.value}
                    onChange={e => setActionNote(n => ({ ...n, value: e.target.value }))}
                    style={{ flex: 1, minWidth: 200, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}
                  />
                  <button disabled={busy} onClick={() => doAction('complete', 'put', { note: actionNote.value }).then(() => setActionNote({ id: null, value: '' }))} style={{
                    padding: '8px 16px', background: '#3B82F6', color: '#fff',
                    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: busy ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif',
                    opacity: busy ? 0.6 : 1,
                  }}>
                    {busy ? '...' : 'Submit'}
                  </button>
                  <button onClick={() => setActionNote({ id: null, value: '' })} style={{ padding: '8px 12px', background: 'var(--surface-3)', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', color: 'var(--text-secondary)' }}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setActionNote({ id: m._id, value: '' })} style={{
                  padding: '7px 16px', background: '#EFF6FF', color: '#1D4ED8',
                  border: '1px solid #BFDBFE', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: '"DM Sans", sans-serif',
                }}>Mark as Done</button>
              )}
            </>
          )}

          {/* Client: approve or reject completed milestone */}
          {isClient && m.status === 'completed' && (
            <>
              <button disabled={busy} onClick={() => doAction('approve')} style={{
                padding: '7px 16px', background: '#ECFDF5', color: '#059669',
                border: '1px solid #86EFAC', borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: busy ? 'not-allowed' : 'pointer',
                fontFamily: '"DM Sans", sans-serif', opacity: busy ? 0.6 : 1,
              }}>✓ Approve & Release ₹{m.amount.toLocaleString()}</button>

              {showNoteInput ? (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    placeholder="Reason for rejection..."
                    value={actionNote.value}
                    onChange={e => setActionNote(n => ({ ...n, value: e.target.value }))}
                    style={{ flex: 1, minWidth: 180, padding: '8px 12px', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}
                  />
                  <button disabled={busy} onClick={() => doAction('reject', 'put', { note: actionNote.value }).then(() => setActionNote({ id: null, value: '' }))} style={{
                    padding: '8px 14px', background: '#FEF2F2', color: '#DC2626',
                    border: '1px solid #FECACA', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                  }}>Send Back</button>
                  <button onClick={() => setActionNote({ id: null, value: '' })} style={{ padding: '8px 12px', background: 'var(--surface-3)', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', color: 'var(--text-secondary)' }}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setActionNote({ id: m._id, value: '' })} style={{
                  padding: '7px 14px', background: '#FEF2F2', color: '#DC2626',
                  border: '1px solid #FECACA', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                }}>✕ Request Rework</button>
              )}
            </>
          )}

          {/* Approved state visual */}
          {m.status === 'approved' && (
            <span style={{ fontSize: 13, color: '#059669', fontWeight: 500 }}>
              ✓ Payment virtually released
            </span>
          )}

        </div>
      </div>
    </div>
  );
}

/* ── Add Milestone Form ── */
function AddMilestoneForm({ projectId, remaining, onSuccess, onCancel }) {
  const [form, setForm] = useState({ title: '', amount: '', dueDate: '', note: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid var(--border)', borderRadius: 9,
    fontSize: 14, fontFamily: '"DM Sans", sans-serif',
    color: 'var(--text-primary)', background: '#fff', outline: 'none',
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post(`/projects/${projectId}/milestones`, {
        ...form, amount: Number(form.amount),
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add milestone');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', border: '1px solid var(--accent)', boxShadow: '0 0 0 3px rgba(79,70,229,0.07)' }}>
      <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>
        New Milestone
      </h3>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Title</label>
            <input placeholder="e.g. Design Mockups" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
              Amount (₹) <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— max ₹{remaining.toLocaleString()} remaining</span>
            </label>
            <input type="number" placeholder="e.g. 1500" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required min="1" max={remaining} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required min={new Date().toISOString().split('T')[0]} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Note (optional)</label>
            <input placeholder="Deliverables or instructions..." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onCancel} style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 9, background: 'transparent', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} style={{ padding: '10px 24px', background: loading ? '#A5B4FC' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 12px rgba(79,70,229,0.2)' }}>
            {loading ? 'Adding...' : 'Add Milestone'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Loader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading milestones...</div>
    </div>
  );
}