import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen]     = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef           = useRef(null);
  const navigate              = useNavigate();

  const unread = notifications.filter(n => !n.isRead).length;

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch { /* not critical */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
  };

  const handleClick = async (notif) => {
    if (!notif.isRead) {
      await api.put(`/notifications/${notif._id}/read`);
      setNotifications(n => n.map(x => x._id === notif._id ? { ...x, isRead: true } : x));
    }
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  const TYPE_ICON = {
    bid_accepted:       '🎉',
    bid_rejected:       '😔',
    bid_received:       '📩',
    milestone_approved: '✅',
    milestone_rejected: '⚠️',
    review_received:    '⭐',
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(v => !v); if (!open) load(); }}
        style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', padding: '4px 6px', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
        title="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 17, height: 17, borderRadius: '50%',
            background: '#EF4444', color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--surface)',
            fontFamily: '"DM Sans", sans-serif',
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 340, maxHeight: 420, overflowY: 'auto',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14, boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            position: 'sticky', top: 0, background: 'var(--surface)',
            borderRadius: '14px 14px 0 0',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: '"DM Sans", sans-serif' }}>
              Notifications {unread > 0 && <span style={{ color: 'var(--accent)' }}>({unread})</span>}
            </span>
            {unread > 0 && (
              <button onClick={markAllRead} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: 'var(--accent)', fontWeight: 600,
                fontFamily: '"DM Sans", sans-serif', padding: 0,
              }}>Mark all read</button>
            )}
          </div>

          {/* List */}
          {loading && notifications.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>Loading...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n._id}
                onClick={() => handleClick(n)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  background: n.isRead ? 'transparent' : 'var(--accent-light)',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                onMouseLeave={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'var(--accent-light)'}
              >
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>
                  {TYPE_ICON[n.type] || '🔔'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: '0 0 3px', lineHeight: 1.5, fontFamily: '"DM Sans", sans-serif' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                {!n.isRead && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 6 }} />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}