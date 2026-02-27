import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import ProfileForm from "../components/ProfileForm";
import "../styles/dashboard.css";

export default function StudentDashboard() {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [profileComplete, setProfileComplete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [studentRegistrations, setStudentRegistrations] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        upcomingEvents: 0,
        completedEvents: 0
    });

    // Check if profile is complete - runs FIRST on mount
    useEffect(() => {
        const checkProfileStatus = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:5000/api/auth/profile/check', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                const isComplete = data.profileComplete || false;
                setProfileComplete(isComplete);

                // IMPORTANT: Show profile form if profile is not complete
                if (!isComplete) {
                    setShowProfileForm(true);
                }
            } catch (err) {
                console.error('Error checking profile:', err);
            }
        };

        checkProfileStatus();
    }, [token]);

    // Fetch student profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:5000/api/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudentProfile(data);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchProfile();
    }, [token, profileComplete]);

    // Fetch student registrations
    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:5000/api/registrations/my-registrations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    // Filter out registrations where the event was deleted
                    const validRegistrations = data.filter(reg => reg.event && reg.event._id);
                    setStudentRegistrations(validRegistrations);

                    // Calculate stats based on valid registrations only
                    const nowDate = new Date();
                    const upcoming = validRegistrations.filter(reg => new Date(reg.event?.eventDate) > nowDate).length;
                    const completed = validRegistrations.filter(reg => new Date(reg.event?.eventDate) < nowDate).length;

                    setStats({
                        totalRegistrations: validRegistrations.length,
                        upcomingEvents: upcoming,
                        completedEvents: completed
                    });
                }
            } catch (err) {
                console.error('Error fetching registrations:', err);
            }
        };

        fetchRegistrations();
    }, [token, profileComplete]);

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:5000/api/events/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const transformedEvents = data.slice(0, 3).map(ev => ({
                        ...ev,
                        image: ev.image ?
                            (ev.image.startsWith('http') ? ev.image : `http://localhost:5000/uploads/${ev.image}`) :
                            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'
                    }));
                    setFeaturedEvents(transformedEvents);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [token]);

    const handleProfileComplete = () => {
        setProfileComplete(true);
        setShowProfileForm(false);
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <Sidebar role="student" />
                <main className="main-content">
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', color: '#6F767E' }}>Loading your dashboard...</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {showProfileForm && (
                <ProfileForm
                    onProfileComplete={handleProfileComplete}
                    onClose={() => setShowProfileForm(false)}
                />
            )}

            <Sidebar role="student" />
            <main className="main-content">
                <Header userName={studentProfile?.name || user?.name || "Student"} userRole="Student" id={user?.id} />

                <div className="welcome-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                        <div>
                            <h1>Welcome back, {(studentProfile?.name?.split(' ')[0]) || (user?.name?.split(' ')[0]) || 'Student'}! 👋</h1>
                            <p>
                                {studentProfile?.department ? `📚 ${studentProfile.department}` : 'Your dashboard'}
                                {studentProfile?.year ? ` • Year ${studentProfile.year}` : ''}
                                {studentProfile?.college ? ` • ${studentProfile.college}` : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowProfileForm(true)}
                            style={{
                                padding: '10px 16px',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                            ✏️ Update Profile
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        {/* Total Registrations Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                            borderRadius: '18px',
                            padding: '24px',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            backdropFilter: 'blur(12px)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(102,126,234,0.25)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>Total Registrations</div>
                                <div style={{ width: '42px', height: '42px', background: 'rgba(102, 126, 234, 0.2)', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📋</div>
                            </div>
                            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{stats.totalRegistrations}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(102, 126, 234, 0.9)', marginTop: '8px', fontWeight: '600', background: 'rgba(102, 126, 234, 0.12)', display: 'inline-block', padding: '2px 10px', borderRadius: '50px', border: '1px solid rgba(102,126,234,0.25)' }}>All time</div>
                        </div>

                        {/* Upcoming Events Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.12) 100%)',
                            borderRadius: '18px',
                            padding: '24px',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            backdropFilter: 'blur(12px)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(16,185,129,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>Upcoming Events</div>
                                <div style={{ width: '42px', height: '42px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🚀</div>
                            </div>
                            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{stats.upcomingEvents}</div>
                            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '8px', fontWeight: '600', background: 'rgba(16, 185, 129, 0.12)', display: 'inline-block', padding: '2px 10px', borderRadius: '50px', border: '1px solid rgba(16,185,129,0.25)' }}>Upcoming</div>
                        </div>

                        {/* Completed Events Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
                            borderRadius: '18px',
                            padding: '24px',
                            border: '1px solid rgba(8, 145, 178, 0.25)',
                            backdropFilter: 'blur(12px)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(8,145,178,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>Completed Events</div>
                                <div style={{ width: '42px', height: '42px', background: 'rgba(8, 145, 178, 0.15)', border: '1px solid rgba(8, 145, 178, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>✅</div>
                            </div>
                            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{stats.completedEvents}</div>
                            <div style={{ fontSize: '12px', color: '#0891b2', marginTop: '8px', fontWeight: '600', background: 'rgba(8, 145, 178, 0.12)', display: 'inline-block', padding: '2px 10px', borderRadius: '50px', border: '1px solid rgba(8,145,178,0.25)' }}>Attended</div>
                        </div>
                    </div>
                </div>

                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(135deg, #667eea, #a855f7)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🎯 Featured Events</h2>
                        <button
                            style={{
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                border: '1px solid rgba(102,126,234,0.3)',
                                background: 'rgba(102,126,234,0.08)',
                                cursor: 'pointer',
                                fontSize: '13px',
                                padding: '6px 16px',
                                borderRadius: '50px',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => navigate('/events')}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(102,126,234,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(102,126,234,0.08)'; }}
                        >
                            View all →
                        </button>
                    </div>
                    {featuredEvents.length === 0 ? (
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <p style={{ color: '#94a3b8' }}>No events available right now. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid-layout">
                            {featuredEvents.map((event, idx) => (
                                <div key={idx} style={{
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                    onClick={() => navigate('/events')}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(102,126,234,0.35)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{
                                        height: '160px',
                                        backgroundImage: `url(${event.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundColor: 'rgba(102,126,234,0.1)',
                                        position: 'relative'
                                    }}>
                                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(102,126,234,0.9)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {event.category || 'Tech'}
                                        </div>
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 8px 0', color: '#fff' }}>{event.title}</h3>
                                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px 0' }}>{event.description?.substring(0, 70)}...</p>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '12px' }}>
                                            <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                                            <span>📍 {event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section style={{ marginTop: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(135deg, #667eea, #a855f7)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📝 Your Registrations ({studentRegistrations.length})</h2>
                        <button
                            style={{
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                border: '1px solid rgba(102,126,234,0.3)',
                                background: 'rgba(102,126,234,0.08)',
                                cursor: 'pointer',
                                fontSize: '13px',
                                padding: '6px 16px',
                                borderRadius: '50px',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => navigate('/registrations')}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(102,126,234,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(102,126,234,0.08)'; }}
                        >
                            Register for more →
                        </button>
                    </div>

                    {studentRegistrations.length === 0 ? (
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📅</div>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>No registrations yet. Head over to the Events page to register for upcoming events!</p>
                        </div>
                    ) : (
                        <div className="registrations-list">
                            {studentRegistrations.slice(0, 5).map((registration, idx) => {
                                const isUpcoming = new Date(registration.event?.eventDate) > new Date();
                                return (
                                    <div key={registration._id || idx} style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        borderRadius: '16px',
                                        padding: '20px 24px',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        marginBottom: '12px',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(102,126,234,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                                                <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))', border: '1px solid rgba(102,126,234,0.3)', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                                                    <span style={{ fontSize: '18px', color: '#fff', lineHeight: 1 }}>
                                                        {new Date(registration.event?.eventDate).getDate()}
                                                    </span>
                                                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em' }}>
                                                        {new Date(registration.event?.eventDate).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0', color: '#fff' }}>{registration.event?.title}</h4>
                                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '3px' }}>
                                                        🕒 {new Date(registration.event?.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                                        📍 {registration.event?.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <span style={{
                                                background: isUpcoming ? 'rgba(16, 185, 129, 0.12)' : 'rgba(102,126,234,0.12)',
                                                color: isUpcoming ? '#10b981' : '#667eea',
                                                border: isUpcoming ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(102,126,234,0.25)',
                                                padding: '6px 14px',
                                                borderRadius: '50px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                whiteSpace: 'nowrap',
                                                marginLeft: '16px'
                                            }}>
                                                {isUpcoming ? '🚀 Upcoming' : '✅ Completed'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
