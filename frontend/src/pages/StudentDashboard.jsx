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
                    setStudentRegistrations(data);
                    
                    // Calculate stats
                    const nowDate = new Date();
                    const upcoming = data.filter(reg => new Date(reg.event?.eventDate) > nowDate).length;
                    const completed = data.filter(reg => new Date(reg.event?.eventDate) < nowDate).length;
                    
                    setStats({
                        totalRegistrations: data.length,
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
                    setFeaturedEvents(data.slice(0, 3));
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
                    onClose={() => {}}
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #EFEFEF' }}>
                            <div style={{ fontSize: '14px', color: '#6F767E', marginBottom: '8px' }}>Total Registrations</div>
                            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>{stats.totalRegistrations}</div>
                        </div>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #EFEFEF' }}>
                            <div style={{ fontSize: '14px', color: '#6F767E', marginBottom: '8px' }}>Upcoming Events</div>
                            <div style={{ fontSize: '32px', fontWeight: '700', color: '#16a34a' }}>{stats.upcomingEvents}</div>
                        </div>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #EFEFEF' }}>
                            <div style={{ fontSize: '14px', color: '#6F767E', marginBottom: '8px' }}>Completed Events</div>
                            <div style={{ fontSize: '32px', fontWeight: '700', color: '#0891b2' }}>{stats.completedEvents}</div>
                        </div>
                    </div>
                </div>

                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px' }}>🎯 Featured Events</h2>
                        <button 
                            style={{
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                            onClick={() => navigate('/events')}
                        >
                            View all →
                        </button>
                    </div>
                    {featuredEvents.length === 0 ? (
                        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px solid #EFEFEF' }}>
                            <p style={{ color: '#6F767E' }}>No events available right now. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid-layout">
                            {featuredEvents.map((event, idx) => (
                                <div key={idx} style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid #EFEFEF',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    textDecoration: 'none'
                                }}>
                                    <div style={{
                                        height: '200px',
                                        backgroundImage: `url(${event.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}></div>
                                    <div style={{ padding: '16px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0' }}>{event.title}</h3>
                                        <p style={{ fontSize: '14px', color: '#6F767E', margin: '0 0 12px 0' }}>{event.description?.substring(0, 60)}...</p>
                                        <div style={{ fontSize: '13px', color: '#6F767E' }}>
                                            📅 {new Date(event.eventDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section style={{ marginTop: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px' }}>📝 Your Registrations ({studentRegistrations.length})</h2>
                        <button
                            style={{
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                            onClick={() => navigate('/events')}
                        >
                            Register for more →
                        </button>
                    </div>
                    
                    {studentRegistrations.length === 0 ? (
                        <div className="registrations-list" style={{ background: 'white', borderRadius: '12px', padding: '40px', border: '1px solid #EFEFEF', textAlign: 'center' }}>
                            <p style={{ color: '#6F767E', margin: 0 }}>No registrations yet. Head over to the Events page to register for upcoming events!</p>
                        </div>
                    ) : (
                        <div className="registrations-list">
                            {studentRegistrations.slice(0, 5).map((registration, idx) => (
                                <div key={registration._id || idx} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #EFEFEF', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
                                            <div style={{ width: '70px', height: '70px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>
                                                <span style={{ fontSize: '20px' }}>
                                                    {new Date(registration.event?.eventDate).getDate()}
                                                </span>
                                                <span style={{ fontSize: '11px' }}>
                                                    {new Date(registration.event?.eventDate).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0' }}>{registration.event?.title}</h4>
                                                <div style={{ fontSize: '13px', color: '#6F767E', marginBottom: '4px' }}>
                                                    🕒 {new Date(registration.event?.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#6F767E' }}>
                                                    📍 {registration.event?.location}
                                                </div>
                                            </div>
                                        </div>
                                        <span style={{ background: '#e8f4f8', color: '#0891b2', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                                            {registration.status || 'Registered'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
