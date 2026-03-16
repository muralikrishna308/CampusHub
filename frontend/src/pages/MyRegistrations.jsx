import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './MyRegistrations.css';

const CATEGORIES = [
    { id: 'all', name: 'All', emoji: '🌟' },
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
    const [studentProfile, setStudentProfile] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        completed: 0
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) return;
            try {
                const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setStudentProfile(profileData);
                }

                setLoading(true);
                const response = await fetch('http://localhost:5000/api/registrations/my-registrations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const validRegs = data
                        .filter(reg => reg.event && reg.event._id)
                        .map(reg => ({
                            ...reg,
                            event: {
                                ...reg.event,
                                image: reg.event.image ?
                                    (reg.event.image.startsWith('http') ? reg.event.image : `http://localhost:5000/uploads/${reg.event.image}`) :
                                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'
                            }
                        }));
                    setRegistrations(validRegs);

                    const now = new Date();
                    const tot = validRegs.length;
                    const up = validRegs.filter(r => new Date(r.event.eventDate) > now).length;
                    const cp = tot - up;
                    setStats({ total: tot, upcoming: up, completed: cp });
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    const filteredRegistrations = selectedCategory === 'all'
        ? registrations
        : registrations.filter(reg => reg.event.category === selectedCategory);

    const getCatColor = (catId) => {
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

            <main className="main-content">
                <Header
                    userName={studentProfile?.name || user?.name || "Student"}
                    userRole="Student"
                    id={user?.id}
                />

                <div className="myreg-content-wrapper">
                    {/* Page Title */}
                    <div className="myreg-page-title">
                        <div>
                            <h1>📋 My Registrations</h1>
                            <p>Track and manage all your event registrations</p>
                        </div>
                    </div>

                    {/* Toolbar: Filters + Results Count */}
                    <div className="myreg-toolbar">
                        <div className="myreg-filters">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`myreg-chip ${selectedCategory === cat.id ? 'myreg-chip--active' : ''}`}
                                >
                                    <span>{cat.emoji}</span>
                                    <span>{cat.name}</span>
                                    {selectedCategory === cat.id && (
                                        <span className="myreg-chip__count">
                                            {filteredRegistrations.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <span className="myreg-results-label">
                            {filteredRegistrations.length} registration{filteredRegistrations.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="myreg-loading">
                            <div className="spinner"></div>
                            <p>Loading your registrations...</p>
                        </div>
                    ) : filteredRegistrations.length === 0 ? (
                        <div className="myreg-empty">
                            <div className="myreg-empty__icon">📅</div>
                            <h3>No registrations found</h3>
                            <p>
                                {selectedCategory === 'all'
                                    ? "You haven't registered for any events yet. Discover exciting events to get started!"
                                    : "No registrations in this category. Try exploring other categories or browse all events."}
                            </p>
                            <button
                                className="myreg-empty__btn"
                                onClick={() => selectedCategory === 'all' ? navigate('/events') : setSelectedCategory('all')}
                            >
                                {selectedCategory === 'all' ? '🔍 Explore Events' : '← View All Categories'}
                            </button>
                        </div>
                    ) : (
                        <div className="myreg-grid">
                            {filteredRegistrations.map((reg, idx) => {
                                const event = reg.event;
                                const isUpcoming = new Date(event.eventDate) > new Date();
                                return (
                                    <div key={reg._id || idx} className="myreg-card">
                                        <div className="myreg-card__img">
                                            <div
                                                className="myreg-card__img-inner"
                                                style={{ backgroundImage: `url(${event.image})` }}
                                            />
                                            <span
                                                className="myreg-card__cat-badge"
                                                style={{ background: getCatColor(event.category) }}
                                            >
                                                {CATEGORIES.find(c => c.id === event.category)?.emoji || '📅'}{' '}
                                                {CATEGORIES.find(c => c.id === event.category)?.name || event.category}
                                            </span>
                                            <span className={`myreg-card__status-badge ${isUpcoming ? 'myreg-card__status-badge--upcoming' : 'myreg-card__status-badge--done'}`}>
                                                {isUpcoming ? '🕒 UPCOMING' : '✅ COMPLETED'}
                                            </span>
                                        </div>

                                        <div className="myreg-card__body">
                                            <h3 className="myreg-card__title">{event.title}</h3>
                                            <p className="myreg-card__desc">
                                                {event.description?.substring(0, 110)}...
                                            </p>

                                            <div className="myreg-card__meta">
                                                <div className="myreg-meta-row">
                                                    <span className="myreg-meta-icon">📅</span>
                                                    <span>{new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="myreg-meta-row">
                                                    <span className="myreg-meta-icon">📍</span>
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>

                                             <div className="myreg-card__footer">
                                                <div className="myreg-price-box">
                                                    <span className="myreg-price-label">Ticket Price</span>
                                                    <span className="myreg-price-value">
                                                        {event.ticketPrice ? `₹${event.ticketPrice}` : 'Free'}
                                                    </span>
                                                </div>
                                                <div className="myreg-card__confirmed" style={{
                                                    color: reg.status === 'accepted' ? '#22c55e' : reg.status === 'rejected' ? '#ef4444' : '#ffab00',
                                                    background: reg.status === 'accepted' ? 'rgba(34, 197, 94, 0.1)' : reg.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 171, 0, 0.1)',
                                                    border: reg.status === 'accepted' ? '1px solid rgba(34, 197, 94, 0.2)' : reg.status === 'rejected' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255, 171, 0, 0.2)',
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                    fontWeight: '700',
                                                    fontSize: '11px'
                                                }}>
                                                    <span style={{ fontSize: '10px', marginRight: '4px' }}>●</span> 
                                                    {reg.status?.toUpperCase() || 'PENDING'}
                                                </div>
                                            </div>

                                            <button
                                                className="myreg-card__btn"
                                                onClick={() => navigate('/events')}
                                            >
                                                View Event Details →
                                            </button>
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
