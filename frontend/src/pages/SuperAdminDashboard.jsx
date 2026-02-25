import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SuperAdminDashboard.css';

/* ─── Dummy event images ─── */
const eventImages = {
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  music: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
  workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  networking: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
  charity: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
};

/* ─── Registration trend data (monthly) ─── */
const trendData = [
  { month: 'Sep', registrations: 120, revenue: 4800 },
  { month: 'Oct', registrations: 185, revenue: 7400 },
  { month: 'Nov', registrations: 210, revenue: 8400 },
  { month: 'Dec', registrations: 160, revenue: 6400 },
  { month: 'Jan', registrations: 290, revenue: 11600 },
  { month: 'Feb', registrations: 245, revenue: 9800 },
  { month: 'Mar', registrations: 320, revenue: 12800 },
];

export default function SuperAdminDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reportFilters, setReportFilters] = useState({
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    eventType: 'all',
    format: 'pdf',
  });

  /* ─── Data fetch ─── */
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setStats({
        totalEvents: 24,
        activeEvents: 8,
        totalRegistrations: 1250,
        totalRevenue: 45800,
        growth: 15.5,
        events: [
          { _id: 1, title: 'Tech Conference 2024', registered: 245, capacity: 300, active: true, image: eventImages.tech, date: '2024-03-15', location: 'Convention Center', category: 'Technology', revenue: 12500, status: 'upcoming', description: 'Annual technology conference featuring latest trends in AI and Web Development.', speaker: 'Dr. Sarah Johnson', time: '09:00 AM – 06:00 PM' },
          { _id: 2, title: 'Music Festival', registered: 189, capacity: 200, active: true, image: eventImages.music, date: '2024-03-20', location: 'Central Park', category: 'Music', revenue: 8900, status: 'upcoming', description: 'A day filled with amazing performances from top artists.', speaker: 'Various Artists', time: '12:00 PM – 11:00 PM' },
          { _id: 3, title: 'Workshop: React Basics', registered: 78, capacity: 100, active: false, image: eventImages.workshop, date: '2024-02-28', location: 'Online', category: 'Education', revenue: 3900, status: 'completed', description: 'Learn React fundamentals in this hands-on workshop.', speaker: 'Mike Johnson', time: '10:00 AM – 04:00 PM' },
          { _id: 4, title: 'Networking Mixer', registered: 156, capacity: 200, active: true, image: eventImages.networking, date: '2024-03-25', location: 'Business Center', category: 'Networking', revenue: 6200, status: 'upcoming', description: 'Connect with professionals from various industries.', speaker: 'Networking Hosts', time: '06:00 PM – 09:00 PM' },
          { _id: 5, title: 'Charity Run', registered: 320, capacity: 500, active: true, image: eventImages.charity, date: '2024-04-01', location: 'City Stadium', category: 'Charity', revenue: 15000, status: 'upcoming', description: 'Annual charity run to support local causes.', speaker: 'Charity Org', time: '08:00 AM – 12:00 PM' },
        ],
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', events: 5, joined: '2024-01-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'student', events: 3, joined: '2024-01-20' },
          { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'organizer', events: 8, joined: '2023-12-10' },
          { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'student', events: 2, joined: '2024-02-01' },
          { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'admin', events: 12, joined: '2023-11-05' },
        ],
        recentActivity: [
          { id: 1, action: 'New registration', user: 'John Doe', event: 'Tech Conference', time: '2 min ago', icon: '📝' },
          { id: 2, action: 'Payment received', user: 'Jane Smith', event: 'Workshop', time: '1 hr ago', icon: '💳' },
          { id: 3, action: 'Event ', user: 'Admin', event: 'Music Festival', time: '3 hrs ago', icon: '👁️' },
          { id: 4, action: 'Event completed', user: 'System', event: 'React Basics', time: '1 day ago', icon: '✅' },
        ],
      });
      setLoading(false);
    }, 900);
  }, [token]);

  const fetchNotifications = useCallback(() => {
    setNotifications([
      { id: 1, message: 'Tech Conference starts in 2 days', read: false, time: '5 min ago' },
      { id: 2, message: 'New user registered: Sarah Johnson', read: false, time: '1 hr ago' },
      { id: 3, message: 'Payment received: $500 from Event Corp', read: false, time: '3 hrs ago' },
      { id: 4, message: 'Event capacity reached: Music Festival', read: true, time: '1 day ago' },
    ]);
  }, []);

  useEffect(() => { fetchDashboardData(); fetchNotifications(); }, [fetchDashboardData, fetchNotifications]);

  const notifRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const markRead = id => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const unreadCount = notifications.filter(n => !n.read).length;

  if (error) return (
    <div className="sa-error-page">
      <div className="sa-orb sa-orb--a" /><div className="sa-orb sa-orb--b" />
      <div className="sa-error-card">
        <span style={{ fontSize: '2.5rem' }}>⚠️</span>
        <h2>Dashboard Error</h2>
        <p>{error}</p>
        <button className="sa-btn-primary" onClick={fetchDashboardData}>Retry</button>
      </div>
    </div>
  );

  return (
    <div className="sa-root">
      {/* Ambient background */}
      <div className="sa-bg-layer" aria-hidden="true">
        <div className="sa-orb sa-orb--a" />
        <div className="sa-orb sa-orb--b" />
        <div className="sa-grid-lines" />
      </div>

      {/* ══ HEADER ══ */}
      <header className="sa-header">
        <div className="sa-header-inner">
          {/* Brand */}
          <div className="sa-brand">
            <div className="sa-brand-icon">
              <span className="sa-logomark">✦</span>
            </div>
            <div>
              <div className="sa-brand-name">CampusHub <span className="sa-brand-tag">Super Admin</span></div>
              <div className="sa-brand-sub">Management Console</div>
            </div>
          </div>

          {/* Right controls */}
          <div className="sa-header-controls">
            {/* Notifications */}
            <div className="sa-notif-wrap" ref={notifRef}>
              <button className="sa-icon-btn" onClick={() => setShowNotifications(v => !v)}>
                🔔
                {unreadCount > 0 && <span className="sa-badge-dot">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="sa-notif-panel">
                  <div className="sa-notif-head">
                    <span className="sa-notif-title">Notifications</span>
                    <span className="sa-notif-new">{unreadCount} new</span>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`sa-notif-item ${n.read ? '--read' : '--unread'}`} onClick={() => markRead(n.id)}>
                      <span className="sa-notif-dot-ind" />
                      <div>
                        <p className="sa-notif-msg">{n.message}</p>
                        <small className="sa-notif-time">{n.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User pill */}
            <div className="sa-user-pill">
              <div className="sa-avatar">{user?.name?.[0] || user?.email?.[0] || 'A'}</div>
              <div className="sa-user-text">
                <span className="sa-user-name">{user?.name || user?.email || 'Administrator'}</span>
                <span className="sa-user-role">Super Admin</span>
              </div>
            </div>

            <button className="sa-logout-btn" onClick={handleLogout}>Sign out →</button>
          </div>
        </div>
      </header>

      {/* ══ TAB BAR ══ */}
      <div className="sa-tabbar">
        <div className="sa-tabbar-inner">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'events', icon: '📅', label: 'Events' },
            { id: 'users', icon: '👥', label: 'Users' },
            { id: 'reports', icon: '📈', label: 'Analytics' },
          ].map(t => (
            <button
              key={t.id}
              className={`sa-tab ${activeTab === t.id ? 'sa-tab--active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <main className="sa-main">
        {loading ? (
          <div className="sa-loading">
            <div className="sa-spinner" />
            <span>Loading data…</span>
          </div>
        ) : stats && (
          <div className="sa-pane" key={activeTab}>

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <>
                {/* Stat strip */}
                <div className="sa-stat-grid">
                  <StatCard icon="📅" label="Total Events" value={stats.totalEvents} accent="purple" trend="+12%" />
                  <StatCard icon="🔥" label="Active Events" value={stats.activeEvents} accent="blue" trend="Stable" />
                  <StatCard icon="👥" label="Total Members" value={stats.totalRegistrations.toLocaleString()} accent="violet" trend="+245" />
                  <StatCard icon="💰" label="Platform Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} accent="green" trend={`+${stats.growth}%`} />
                </div>

                {/* Quick event cards */}
                <SectionHead title="Live Events" pill="Top 3" />
                <div className="sa-event-grid">
                  {stats.events.slice(0, 3).map(ev => (
                    <EventCard key={ev._id} event={ev} onClick={() => setSelectedEvent(ev)} />
                  ))}
                </div>

                {/* Activity log */}
                <SectionHead title="Recent Activity" pill="System Log" />
                <div className="sa-activity-card">
                  {stats.recentActivity.map((a, i) => (
                    <div key={a.id} className="sa-activity-row" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="sa-activity-icon">{a.icon}</div>
                      <div className="sa-activity-body">
                        <span className="sa-activity-action">{a.action}</span>
                        <span className="sa-activity-meta">{a.user} · {a.event}</span>
                      </div>
                      <span className="sa-activity-time">{a.time}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── EVENTS ── */}
            {activeTab === 'events' && (
              <>
                <div className="sa-tabhead">
                  <SectionHead title="Event Registry" pill={`${stats.events.length} events`} />
                  <div className="sa-filter-bar">
                    <input className="sa-search" type="text" placeholder="🔍  Search events…" />
                    <select className="sa-select">
                      <option>All Categories</option>
                      <option>Technology</option>
                      <option>Music</option>
                      <option>Education</option>
                      <option>Networking</option>
                      <option>Charity</option>
                    </select>
                  </div>
                </div>

                <div className="sa-table-box">
                  <table className="sa-table">
                    <thead><tr>
                      <th>Event</th><th>Date</th><th>Location</th>
                      <th>Registrations</th><th>Revenue</th><th>Status</th><th>Details</th>
                    </tr></thead>
                    <tbody>
                      {stats.events.map(ev => (
                        <tr key={ev._id}>
                          <td>
                            <div className="sa-cell-event">
                              <img src={ev.image} alt={ev.title} className="sa-thumb" />
                              <div>
                                <div className="sa-cell-title">{ev.title}</div>
                                <div className="sa-cell-sub">{ev.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="sa-muted">{new Date(ev.date).toLocaleDateString()}</td>
                          <td className="sa-muted">{ev.location}</td>
                          <td>
                            <span className="sa-muted">{ev.registered}/{ev.capacity}</span>
                            <MiniBar pct={Math.round((ev.registered / ev.capacity) * 100)} />
                          </td>
                          <td className="sa-green">${ev.revenue.toLocaleString()}</td>
                          <td><StatusBadge status={ev.status} /></td>
                          <td>
                            <button className="sa-view-btn" onClick={() => setSelectedEvent(ev)}>View ↗</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── USERS ── */}
            {activeTab === 'users' && (
              <>
                <div className="sa-tabhead">
                  <SectionHead title="User Directory" pill={`${stats.users.length} users`} />
                  <input className="sa-search" style={{ maxWidth: '360px' }} type="text" placeholder="🔍  Search by name or email…" />
                </div>

                <div className="sa-table-box">
                  <table className="sa-table">
                    <thead><tr>
                      <th>User</th><th>Email</th><th>Role</th><th>Events</th><th>Joined</th>
                    </tr></thead>
                    <tbody>
                      {stats.users.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div className="sa-cell-event">
                              <div className="sa-avatar-sm">{u.name[0]}</div>
                              <span className="sa-cell-title">{u.name}</span>
                            </div>
                          </td>
                          <td className="sa-muted">{u.email}</td>
                          <td><RoleBadge role={u.role} /></td>
                          <td className="sa-muted">{u.events} events</td>
                          <td className="sa-muted">{new Date(u.joined).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── ANALYTICS / REPORTS ── */}
            {activeTab === 'reports' && (
              <>
                <SectionHead title="Platform Analytics" pill="Live Data" />

                {/* KPI strip */}
                <div className="sa-kpi-row">
                  <KpiBox label="Total Participants" value="1,530" sub="+18% vs last period" icon="👥" />
                  <KpiBox label="Total Revenue" value="$45,800" sub="+15.5% growth" icon="💰" />
                  <KpiBox label="Avg. Fill Rate" value="78%" sub="Across all events" icon="📊" />
                  <KpiBox label="Completed Events" value="6" sub="Out of 24 total" icon="✅" />
                </div>

                {/* Registration Trend – area chart */}
                <div className="sa-chart-card">
                  <div className="sa-chart-head">
                    <div>
                      <h3 className="sa-chart-title">Registration Trends</h3>
                      <p className="sa-chart-sub">Monthly registrations over the last 7 months</p>
                    </div>
                    <div className="sa-chart-legend">
                      <span className="sa-legend-dot" style={{ background: 'var(--c-primary)' }} /> Registrations
                    </div>
                  </div>
                  <AreaChart data={trendData} />
                </div>

                {/* Participants per event – bar chart */}
                <div className="sa-chart-card">
                  <div className="sa-chart-head">
                    <div>
                      <h3 className="sa-chart-title">Participants per Event</h3>
                      <p className="sa-chart-sub">Total registered vs capacity</p>
                    </div>
                  </div>
                  <BarChart events={stats.events} />
                </div>

                {/* Data table */}
                <div className="sa-report-filters">
                  <div className="sa-filter-group">
                    <label className="sa-filter-label">Date Range</label>
                    <div className="sa-date-range">
                      <input type="date" className="sa-date-input" value={reportFilters.startDate}
                        onChange={e => setReportFilters(f => ({ ...f, startDate: e.target.value }))} />
                      <span className="sa-date-sep">→</span>
                      <input type="date" className="sa-date-input" value={reportFilters.endDate}
                        onChange={e => setReportFilters(f => ({ ...f, endDate: e.target.value }))} />
                    </div>
                  </div>
                  <div className="sa-filter-group">
                    <label className="sa-filter-label">Category</label>
                    <select className="sa-select" value={reportFilters.eventType}
                      onChange={e => setReportFilters(f => ({ ...f, eventType: e.target.value }))}>
                      <option value="all">All Categories</option>
                      <option value="tech">Technology</option>
                      <option value="music">Music</option>
                    </select>
                  </div>
                  <div className="sa-filter-group">
                    <label className="sa-filter-label">Export Format</label>
                    <select className="sa-select" value={reportFilters.format}
                      onChange={e => setReportFilters(f => ({ ...f, format: e.target.value }))}>
                      <option value="pdf">PDF Document</option>
                      <option value="excel">Excel Spreadsheet</option>
                    </select>
                  </div>
                </div>

                <div className="sa-table-box" style={{ marginBottom: '1.5rem' }}>
                  <table className="sa-table">
                    <thead><tr>
                      <th>Event</th><th>Date</th><th>Registrations</th><th>Revenue</th><th>Fill Rate</th>
                    </tr></thead>
                    <tbody>
                      {stats.events.map(ev => (
                        <tr key={ev._id}>
                          <td className="sa-cell-title">{ev.title}</td>
                          <td className="sa-muted">{new Date(ev.date).toLocaleDateString()}</td>
                          <td className="sa-muted">{ev.registered}/{ev.capacity}</td>
                          <td className="sa-green">${ev.revenue.toLocaleString()}</td>
                          <td>
                            <div className="sa-fill-row">
                              <MiniBar pct={Math.round((ev.registered / ev.capacity) * 100)} />
                              <span className="sa-muted" style={{ fontSize: '0.78rem', width: '36px', textAlign: 'right' }}>
                                {Math.round((ev.registered / ev.capacity) * 100)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button className="sa-btn-primary sa-generate-btn"
                  onClick={() => alert(`Generating ${reportFilters.format.toUpperCase()} report…`)}>
                  Generate Report ↓
                </button>
              </>
            )}
          </div>
        )}
      </main>

      {/* ══ EVENT DETAIL MODAL ══ */}
      {selectedEvent && (
        <div className="sa-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <button className="sa-modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            <div className="sa-modal-img-wrap">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="sa-modal-img" />
              <div className="sa-modal-img-fade" />
              <StatusBadge status={selectedEvent.status} style={{ position: 'absolute', top: '1rem', left: '1rem' }} />
            </div>
            <div className="sa-modal-body">
              <span className="sa-modal-cat">{selectedEvent.category}</span>
              <h2 className="sa-modal-title">{selectedEvent.title}</h2>
              <div className="sa-modal-tags">
                {[`📅 ${new Date(selectedEvent.date).toLocaleDateString()}`,
                `📍 ${selectedEvent.location}`,
                `🕐 ${selectedEvent.time}`,
                `🎤 ${selectedEvent.speaker}`].map(t => (
                  <span key={t} className="sa-modal-tag">{t}</span>
                ))}
              </div>
              <p className="sa-modal-desc">{selectedEvent.description}</p>
              <div className="sa-modal-kpis">
                {[
                  { label: 'Registrations', val: `${selectedEvent.registered}/${selectedEvent.capacity}` },
                  { label: 'Revenue', val: `$${selectedEvent.revenue.toLocaleString()}` },
                  { label: 'Fill Rate', val: `${Math.round((selectedEvent.registered / selectedEvent.capacity) * 100)}%` },
                ].map(k => (
                  <div key={k.label} className="sa-modal-kpi">
                    <span className="sa-modal-kpi-lbl">{k.label}</span>
                    <span className="sa-modal-kpi-val">{k.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*Sub-components*/

function SectionHead({ title, pill }) {
  return (
    <div className="sa-section-head">
      <h2 className="sa-section-title">{title}</h2>
      {pill && <span className="sa-pill">{pill}</span>}
    </div>
  );
}

function StatCard({ icon, label, value, accent, trend }) {
  return (
    <div className={`sa-stat-card sa-stat-card--${accent}`}>
      <div className="sa-stat-card-glow" />
      <div className="sa-stat-row">
        <div className="sa-stat-icon-box">{icon}</div>
        <span className="sa-stat-trend">{trend}</span>
      </div>
      <div className="sa-stat-val">{value}</div>
      <div className="sa-stat-lbl">{label}</div>
    </div>
  );
}

function EventCard({ event, onClick }) {
  const pct = Math.round((event.registered / event.capacity) * 100);
  return (
    <div className="sa-event-card" onClick={onClick}>
      <div className="sa-event-img-wrap">
        <img src={event.image} alt={event.title} className="sa-event-img" />
        <div className="sa-event-img-fade" />
        <StatusBadge status={event.status} className="sa-event-badge" />
        <span className="sa-event-cat">{event.category}</span>
      </div>
      <div className="sa-event-body">
        <h3 className="sa-event-title">{event.title}</h3>
        <p className="sa-event-meta">📅 {new Date(event.date).toLocaleDateString()} · 📍 {event.location}</p>
        <div className="sa-cap-row">
          <span className="sa-muted" style={{ fontSize: '0.78rem' }}>Capacity</span>
          <span className="sa-purple-txt" style={{ fontSize: '0.78rem', fontWeight: 700 }}>{pct}%</span>
        </div>
        <MiniBar pct={pct} />
        <button className="sa-inspect-btn" onClick={e => { e.stopPropagation(); onClick(); }}>View Details ↗</button>
      </div>
    </div>
  );
}

function MiniBar({ pct }) {
  return (
    <div className="sa-mini-bar">
      <div className="sa-mini-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatusBadge({ status, className, style }) {
  return (
    <span className={`sa-status-badge sa-status-badge--${status} ${className || ''}`} style={style}>
      {status}
    </span>
  );
}

function RoleBadge({ role }) {
  return <span className={`sa-role-badge sa-role-badge--${role}`}>{role}</span>;
}

function KpiBox({ icon, label, value, sub }) {
  return (
    <div className="sa-kpi-box">
      <div className="sa-kpi-icon">{icon}</div>
      <div className="sa-kpi-val">{value}</div>
      <div className="sa-kpi-lbl">{label}</div>
      <div className="sa-kpi-sub">{sub}</div>
    </div>
  );
}

/* ─── SVG Area Chart: Registration Trends ─── */
function AreaChart({ data }) {
  const W = 700, H = 200, PAD = { top: 16, right: 20, bottom: 32, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map(d => d.registrations));
  const minVal = 0;

  const xScale = i => PAD.left + (i / (data.length - 1)) * innerW;
  const yScale = v => PAD.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const pts = data.map((d, i) => `${xScale(i)},${yScale(d.registrations)}`).join(' ');
  const areaPath = [
    `M ${xScale(0)},${PAD.top + innerH}`,
    ...data.map((d, i) => `L ${xScale(i)},${yScale(d.registrations)}`),
    `L ${xScale(data.length - 1)},${PAD.top + innerH}`,
    'Z'
  ].join(' ');

  const yTicks = [0, Math.round(maxVal * 0.5), maxVal];

  return (
    <div className="sa-svg-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="sa-svg">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#667eea" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Y grid lines */}
        {yTicks.map(v => (
          <line key={v}
            x1={PAD.left} x2={W - PAD.right}
            y1={yScale(v)} y2={yScale(v)}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1"
          />
        ))}

        {/* Y labels */}
        {yTicks.map(v => (
          <text key={v} x={PAD.left - 6} y={yScale(v) + 4}
            textAnchor="end" fontSize="10" fill="#94a3b8">{v}</text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <polyline points={pts} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots + tooltips */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xScale(i)} cy={yScale(d.registrations)} r="4"
              fill="#667eea" stroke="#0f0f1a" strokeWidth="2" />
            {/* X labels */}
            <text x={xScale(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.month}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── SVG Bar Chart: Participants per Event ─── */
function BarChart({ events }) {
  const W = 700, H = 220, PAD = { top: 16, right: 20, bottom: 48, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxCap = Math.max(...events.map(e => e.capacity));
  const barW = innerW / events.length;
  const gap = barW * 0.28;

  return (
    <div className="sa-svg-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="sa-svg">
        <defs>
          <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </linearGradient>
        </defs>

        {events.map((ev, i) => {
          const x = PAD.left + i * barW + gap / 2;
          const bw = barW - gap;
          const capH = ((ev.capacity / maxCap) * innerH);
          const regH = ((ev.registered / maxCap) * innerH);
          const capY = PAD.top + innerH - capH;
          const regY = PAD.top + innerH - regH;
          const shortName = ev.title.split(' ')[0];

          return (
            <g key={ev._id}>
              {/* Capacity ghost bar */}
              <rect x={x} y={capY} width={bw} height={capH} fill="url(#barGrad2)" rx="4" ry="4" />
              {/* Registered bar */}
              <rect x={x} y={regY} width={bw} height={regH} fill="url(#barGrad1)" rx="4" ry="4" />
              {/* Value label */}
              <text x={x + bw / 2} y={regY - 5} textAnchor="middle" fontSize="9" fill="#e2e8f0" fontWeight="700">
                {ev.registered}
              </text>
              {/* X label */}
              <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="#94a3b8">
                {shortName}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g>
          <rect x={PAD.left} y={H - 3} width={12} height={5} fill="url(#barGrad1)" rx="2" />
          <text x={PAD.left + 16} y={H - 0} fontSize="9" fill="#94a3b8">Registered</text>
          <rect x={PAD.left + 80} y={H - 3} width={12} height={5} fill="url(#barGrad2)" rx="2" />
          <text x={PAD.left + 96} y={H - 0} fontSize="9" fill="#94a3b8">Capacity</text>
        </g>
      </svg>
    </div>
  );
}
