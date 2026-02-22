import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import "../styles/dashboard.css";

export default function StudentDashboard() {
    const featuredEvents = [
        {
            title: "Annual AI & Robotics Summit 2024",
            category: "TECH",
            location: "MIT Auditorium",
            joined: 12,
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Inter-College Battle of Bands",
            category: "MUSIC",
            location: "Stanford Central Park",
            joined: 82,
            image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "UI/UX Prototype Workshop",
            category: "DESIGN",
            location: "Design Lab B2",
            joined: 5,
            image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&w=800&q=80"
        },
    ];

    return (
        <div className="dashboard-container">
            <Sidebar role="student" />
            <main className="main-content">
                <Header userName="Alex Johnson" userRole="Student" id="22934" />

                <div className="welcome-section">
                    <h1>Welcome back, Alex! 👋</h1>
                    <p>There are 12 new events happening at your campus this week.</p>

                    <div className="filters" style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                        <select className="filter-select" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #EFEFEF' }}>
                            <option>All Categories</option>
                        </select>
                        <select className="filter-select" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #EFEFEF' }}>
                            <option>This Week</option>
                        </select>
                        <select className="filter-select" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #EFEFEF' }}>
                            <option>All Colleges</option>
                        </select>
                    </div>
                </div>

                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px' }}>Featured Events</h2>
                        <div className="nav-arrows" style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '8px', borderRadius: '50%', border: '1px solid #EFEFEF', background: 'white' }}>←</button>
                            <button style={{ padding: '8px', borderRadius: '50%', border: '1px solid #EFEFEF', background: 'white' }}>→</button>
                        </div>
                    </div>
                    <div className="grid-layout">
                        {featuredEvents.map((event, idx) => (
                            <EventCard key={idx} {...event} />
                        ))}
                    </div>
                </section>

                <section style={{ marginTop: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px' }}>Your Registrations</h2>
                        <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>View all</a>
                    </div>
                    <div className="registrations-list" style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #EFEFEF' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                                    <span style={{ fontSize: '20px' }}>24</span>
                                    <span style={{ fontSize: '10px' }}>OCT</span>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>Hackathon 2024: Sustainable Future</h4>
                                    <span style={{ fontSize: '14px', color: '#6F767E' }}>🕒 09:00 AM - 06:00 PM  📍 Tech Hub Main Hall</span>
                                </div>
                            </div>
                            <button className="btn-secondary" style={{ background: 'white', border: '1px solid #EFEFEF', padding: '8px 16px', borderRadius: '8px' }}>Add to Calendar</button>
                        </div>
                    </div>
                </section >
            </main >
        </div >
    );
}
