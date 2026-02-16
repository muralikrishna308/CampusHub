import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import "../styles/dashboard.css";

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackStats = [
    { label: "Total Events", value: "1,284", trend: "+12%", icon: "📅" },
    { label: "Active Registrations", value: "8,492", trend: "+24%", icon: "👥" },
    { label: "Participating Colleges", value: "42", trend: "Stable", icon: "🎓" },
  ];

  const fallbackEvents = [
    { title: "Annual AI & Robotics Summit 2024", date: "Nov 12, 2024", location: "MIT Auditorium", registered: "450/500" },
    { title: "Inter-College Battle of Bands", date: "Nov 18, 2024", location: "Stanford Central Park", registered: "820" },
    { title: "UI/UX Prototype Workshop", date: "Nov 22, 2024", location: "Design Lab B2", registered: "15/20" },
  ];

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/dashboard/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [token]);

  const displayStats = stats ? [
    { label: "Total Events", value: stats.totalEvents || "0", trend: "+5%", icon: "📅" },
    { label: "Active Registrations", value: stats.totalRegistrations || "0", trend: "+10%", icon: "👥" },
    { label: "Recent Events", value: stats.recentEvents?.length || "0", trend: "New", icon: "📊" },
  ] : fallbackStats;

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />
      <main className="main-content">
        <Header
          userName={user?.name || "Sarah Jenkins"}
          userRole={user?.role || "System Administrator"}
        />

        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Overview of platform activities and management controls.</p>
        </div>

        <div className="stats-grid">
          {displayStats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px' }}>Manage Recent Events</h2>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>+</span> Create New Event
            </button>
          </div>

          <div className="events-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(stats?.recentEvents?.length > 0 ? stats.recentEvents : fallbackEvents).map((event, idx) => (
              <div key={idx} className="event-item" style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #EFEFEF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    {event.icon || "🎫"}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{event.title}</h4>
                    <span style={{ fontSize: '13px', color: '#6F767E' }}>
                      📅 {event.date ? new Date(event.date).toLocaleDateString() : 'Nov 12, 2024'}
                      📍 {event.location || 'MIT Auditorium'}
                      👥 {event.registered || event.participants || '0'} Registered
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #EFEFEF', background: 'white', cursor: 'pointer' }}>Edit</button>
                  <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #EFEFEF', background: 'white', color: 'var(--primary)', cursor: 'pointer' }}>View Stats</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

