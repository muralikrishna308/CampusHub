import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Events.css'; // Reuse Events.css for consistent card styling

const CATEGORIES = [
    { id: 'all', name: 'All Categories', emoji: '🌟' },
    { id: 'tech', name: 'Technology', emoji: '💻' },
    { id: 'music', name: 'Music & Arts', emoji: '🎸' },
    { id: 'education', name: 'Education', emoji: '📚' },
    { id: 'networking', name: 'Networking', emoji: '🤝' },
    { id: 'sports', name: 'Sports', emoji: '⚽' }
];

const MyRegistrations = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/registrations/my-registrations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    // Filter and prefix images
                    const validRegs = data.filter(reg => reg.event && reg.event._id).map(reg => ({
                        ...reg,
                        event: {
                            ...reg.event,
                            image: reg.event.image ?
                                (reg.event.image.startsWith('http') ? reg.event.image : `http://localhost:5000/uploads/${reg.event.image}`) :
                                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'
                        }
                    }));
                    setRegistrations(validRegs);
                }
            } catch (err) {
                console.error('Error fetching registrations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [token]);

    const filteredRegistrations = selectedCategory === 'all'
        ? registrations
        : registrations.filter(reg => reg.event.category === selectedCategory);

    const getColor = (catId) => {
        const colors = {
            tech: '#6366f1',
            music: '#ec4899',
            education: '#10b981',
            networking: '#f59e0b',
            sports: '#3b82f6',
            all: '#a855f7'
        };
        return colors[catId] || '#6366f1';
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="student" />

            <main className="main-content" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', minHeight: '100vh', color: '#fff' }}>
                <header className="events-header" style={{ padding: '40px 0', marginBottom: '40px', background: 'transparent' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '16px', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            My Registrations
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '600px' }}>
                            Your personal roadmap of upcoming events and workshops.
                        </p>
                    </div>
                </header>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '40px' }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 20px',
                                    borderRadius: '50px',
                                    border: '1px solid',
                                    borderColor: selectedCategory === cat.id ? getColor(cat.id) : 'rgba(255,255,255,0.08)',
                                    background: selectedCategory === cat.id ? `${getColor(cat.id)}15` : 'rgba(255,255,255,0.04)',
                                    color: selectedCategory === cat.id ? getColor(cat.id) : '#fff',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span>{cat.emoji}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                            <div className="spinner"></div>
                            <p style={{ color: '#94a3b8', marginTop: '16px' }}>Loading your registrations...</p>
                        </div>
                    ) : filteredRegistrations.length === 0 ? (
                        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '80px 24px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
                            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>No registrations found</h3>
                            <p style={{ color: '#94a3b8', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                                You haven't registered for any events in this category yet.
                            </p>
                            <button
                                onClick={() => navigate('/events')}
                                style={{ padding: '12px 32px', borderRadius: '50px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 24px rgba(102,126,234,0.3)' }}
                            >
                                Explore Events
                            </button>
                        </div>
                    ) : (
                        <div className="events-grid">
                            {filteredRegistrations.map((reg, idx) => {
                                const event = reg.event;
                                return (
                                    <div key={idx} className="event-card" style={{ transition: 'all 0.3s ease' }}>
                                        <div
                                            className="event-card-img"
                                            style={{ backgroundImage: `url(${event.image})` }}
                                        >
                                            <span
                                                className="event-badge"
                                                style={{ background: getColor(event.category) }}
                                            >
                                                {CATEGORIES.find(c => c.id === event.category)?.emoji || '📅'}{' '}
                                                {CATEGORIES.find(c => c.id === event.category)?.name || event.category}
                                            </span>
                                            <span className="registered-badge" style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(16,185,129,0.9)', color: '#fff', padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: '700' }}>
                                                ✔ CONFIRMED
                                            </span>
                                        </div>

                                        <div className="event-card-body">
                                            <h3 className="event-card-title">{event.title}</h3>
                                            <p className="event-card-desc">
                                                {event.description?.substring(0, 90)}...
                                            </p>

                                            <div className="event-card-meta">
                                                <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                                                <span>📍 {event.location}</span>
                                            </div>

                                            <div className="event-card-footer">
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket Price</span>
                                                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>₹{event.ticketPrice || 0}</span>
                                                </div>
                                                <button
                                                    className="btn-primary"
                                                    style={{ height: '38px', fontSize: '13px' }}
                                                    onClick={() => navigate('/events')}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyRegistrations;
