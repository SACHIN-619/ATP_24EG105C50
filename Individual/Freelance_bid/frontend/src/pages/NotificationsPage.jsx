import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TYPE_ICON = {
  bid_accepted:       '🎉',
  bid_rejected:       '😔',
  bid_received:       '📩',
  milestone_approved: '✅',
  milestone_rejected: '⚠️',
  review_received:    '⭐',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/notifications')
      .then(r => setNotifications(r.data))
      .finally(() => setLoading(false));
  }, []);

  const markAll = async () => {
    await api.put('/notifications/read-all');
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
  };

  const handleClick = async (notif) => {
    if (!notif.isRead) {
      await api.put(`/notifications/${notif._id}/read`);
      setNotifications(n => n.map(x => x._id === notif._id ? { ...x, isRead: true } : x));
    }
    if (notif.link) navigate(notif.link);
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Inbox</p>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 30, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Notifications {unread > 0 && <span style={{ fontSize: 20, color: 'var(--accent)' }}>({unread} new)</span>}
            </h1>
          </div>
          {unread > 0 && (
            <button onClick={markAll} style={{
              padding: '9px 18px', background: 'var(--accent-light)', color: 'var(--accent)',
              border: '1px solid var(--accent)', borderRadius: 9, fontSize: 13,
              fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
            }}>Mark all as read</button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 72, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }} />)}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>All caught up!</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 300 }}>New activity will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.map(n => (
              <div key={n._id} onClick={() => handleClick(n)} style={{
                background: n.isRead ? 'var(--surface)' : 'var(--accent-light)',
                borderRadius: 12, padding: '14px 18px',
                border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(79,70,229,0.2)'}`,
                cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{TYPE_ICON[n.type] || '🔔'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.5, fontFamily: '"DM Sans", sans-serif', fontWeight: n.isRead ? 400 : 500 }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 6 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}