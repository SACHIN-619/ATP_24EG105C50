import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Analytics() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [bids, setBids]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'student') { navigate('/login'); return; }
    api.get('/bids/me').then(r => setBids(r.data)).finally(() => setLoading(false));
  }, [user]);

  const total    = bids.length;
  const accepted = bids.filter(b => b.status === 'accepted').length;
  const rejected = bids.filter(b => b.status === 'rejected').length;
  const pending  = bids.filter(b => b.status === 'pending').length;
  const winRate  = total > 0 ? ((accepted / total) * 100).toFixed(1) : 0;
  const avgBid   = total > 0 ? Math.round(bids.reduce((s, b) => s + b.amount, 0) / total) : 0;
  const avgWinBid = accepted > 0
    ? Math.round(bids.filter(b => b.status === 'accepted').reduce((s, b) => s + b.amount, 0) / accepted)
    : 0;

  // Monthly bids
  const monthlyData = bids.reduce((acc, bid) => {
    const month = new Date(bid.createdAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const months = Object.entries(monthlyData).slice(-6);
  const maxMonthly = Math.max(...months.map(([,v]) => v), 1);

  // Top skills you win with
  const skillWins = bids
    .filter(b => b.status === 'accepted' && b.projectId?.tags)
    .flatMap(b => b.projectId.tags)
    .reduce((acc, tag) => { acc[tag] = (acc[tag] || 0) + 1; return acc; }, {});
  const topSkills = Object.entries(skillWins).sort((a,b) => b[1]-a[1]).slice(0,5);

  const statCard = (label, value, sub, col = 'var(--accent)') => (
    <div style={{ background: 'var(--surface)', borderRadius: 14, padding: '20px 24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: col, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 24px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>My Performance</p>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 30, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Bid Analytics
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <>
            {/* Stat cards */}
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {statCard('Win Rate', `${winRate}%`, `${accepted} of ${total} bids`, '#059669')}
              {statCard('Avg Bid Amount', `₹${avgBid.toLocaleString()}`, 'across all bids')}
              {statCard('Avg Winning Bid', `₹${avgWinBid.toLocaleString()}`, 'bids that got accepted', '#7c3aed')}
              {statCard('Pending', pending, 'awaiting client decision', '#C2410C')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Monthly bar chart */}
              <div className="fade-up fade-up-1" style={{ background: 'var(--surface)', borderRadius: 14, padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>
                  Bids per Month
                </h3>
                {months.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>No data yet</p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
                    {months.map(([month, count]) => (
                      <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>{count}</span>
                        <div style={{
                          width: '100%', borderRadius: '4px 4px 0 0',
                          height: `${(count / maxMonthly) * 110}px`,
                          background: 'linear-gradient(to top, var(--accent), #7c3aed)',
                          minHeight: 4, transition: 'height 0.3s',
                        }} />
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>{month}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bid status breakdown */}
              <div className="fade-up fade-up-2" style={{ background: 'var(--surface)', borderRadius: 14, padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>
                  Bid Breakdown
                </h3>
                {[
                  { label: 'Accepted', count: accepted, col: '#059669', bg: '#ECFDF5' },
                  { label: 'Pending',  count: pending,  col: '#C2410C', bg: '#FFF7ED' },
                  { label: 'Rejected', count: rejected, col: '#DC2626', bg: '#FEF2F2' },
                ].map(({ label, count, col, bg }) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{count}</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${total > 0 ? (count/total)*100 : 0}%`, background: col, borderRadius: 99, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                ))}

                {/* Top winning skills */}
                {topSkills.length > 0 && (
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Top Winning Skills</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {topSkills.map(([skill, count]) => (
                        <span key={skill} style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 7 }}>
                          {skill} ({count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Insight banner */}
            {total >= 3 && (
              <div className="fade-up fade-up-3" style={{ marginTop: 20, background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)', borderRadius: 14, padding: '20px 28px', color: '#fff' }}>
                <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
                  💡 Insight
                </p>
                <p style={{ fontSize: 14, opacity: 0.9, fontWeight: 300 }}>
                  {winRate > 40
                    ? `Strong win rate of ${winRate}%! Your proposals are resonating. Keep bidding in the ₹${avgWinBid.toLocaleString()} range.`
                    : avgBid > avgWinBid
                    ? `You're bidding ₹${avgBid.toLocaleString()} on average but winning at ₹${avgWinBid.toLocaleString()}. Try lowering initial bids to win more projects.`
                    : `You've submitted ${total} bids. Focus on writing more detailed proposals — clients pick students who show they understand the problem.`
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}