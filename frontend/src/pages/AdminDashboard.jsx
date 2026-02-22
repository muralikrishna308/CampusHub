import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import "../styles/dashboard.css";

export default function AdminDashboard() {
    const stats = [
        { label: "Total Events", value: "1,284", trend: "+12%", icon: "📅" },
        { label: "Active Registrations", value: "8,492", trend: "+24%", icon: "👥" },
        { label: "Participating Colleges", value: "42", trend: "Stable", icon: "🎓" },
    ];

    const recentEvents = [
        { title: "Annual AI & Robotics Summit 2024", date: "Nov 12, 2024", location: "MIT Auditorium", registered: "450/500" },
        { title: "Inter-College Battle of Bands", date: "Nov 18, 2024", location: "Stanford Central Park", registered: "820" },
        { title: "UI/UX Prototype Workshop", date: "Nov 22, 2024", location: "Design Lab B2", registered: "15/20" },
    ];

    return (
        <div className="dashboard-container">
            <Sidebar role="admin" />
            <main className="main-content">
                <Header userName="Sarah Jenkins" userRole="System Administrator" />

                <div className="welcome-section">
                    <h1>Admin Dashboard</h1>
                    <p>Overview of platform activities and management controls.</p>
                </div>

                <div className="stats-grid">
                    {stats.map((stat, idx) => (
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
                        {recentEvents.map((event, idx) => (
                            <div key={idx} className="event-item" style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #EFEFEF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', background: '#EEE', borderRadius: '8px' }}></div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{event.title}</h4>
                                        <span style={{ fontSize: '13px', color: '#6F767E' }}>📅 {event.date}  📍 {event.location}  👥 {event.registered} Registered</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #EFEFEF', background: 'white' }}>Edit</button>
                                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #EFEFEF', background: 'white', color: 'var(--primary)' }}>View Stats</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div >
    );
}
