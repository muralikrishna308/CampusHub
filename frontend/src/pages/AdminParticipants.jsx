import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AdminDashboard.css";

const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const toggleSidebar = React.useCallback(() => setSidebarOpen(true), []);
    const closeSidebar = React.useCallback(() => setSidebarOpen(false), []);

    const [adminEvents, setAdminEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    // Fetch admin's events
    useEffect(() => {
        const fetchEvents = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${API_URL}/api/dashboard/admin/events`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAdminEvents(data);
                    if (data.length > 0) {
                        setSelectedEvent(data[0]._id);
                    }
                }
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [token]);

    // Fetch registrations for selected event
    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!selectedEvent || !token) return;
            
            setLoadingRegistrations(true);
            try {
                const response = await fetch(
                    `${API_URL}/api/registrations/event/${selectedEvent}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setRegistrations(data);
                }
            } catch (err) {
                console.error('Error fetching registrations:', err);
            } finally {
                setLoadingRegistrations(false);
            }
        };

        fetchRegistrations();
    }, [selectedEvent, token]);

    const selectedEventData = adminEvents.find(e => e._id === selectedEvent);

    if (loading) {
        return (
            <div className="dashboard-container">
                <Sidebar role="admin" isOpen={sidebarOpen} onClose={closeSidebar} />
                <main className="main-content">
                    <Header userName={user?.name || "Admin"} userRole="Admin" onToggle={toggleSidebar} />
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar role="admin" isOpen={sidebarOpen} onClose={closeSidebar} />
            <main className="main-content">
                <Header 
                    userName={user?.name || "Admin"} 
                    userRole="Admin" 
                    id={user?.id} 
                    onToggle={toggleSidebar}
                />

                <div className="admin-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>📊 Event Participants</h1>
                        <button 
                            onClick={() => navigate('/admin/create-event')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                        >
                            ➕ Create Event
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                        {/* Events List */}
                        <div className="events-list">
                            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Your Events</h3>
                            {adminEvents.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', background: '#f9fafb', borderRadius: '8px' }}>
                                    <p style={{ color: '#6F767E', fontSize: '14px' }}>No events created yet</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {adminEvents.map(event => (
                                        <button
                                            key={event._id}
                                            onClick={() => setSelectedEvent(event._id)}
                                            style={{
                                                padding: '12px 16px',
                                                background: selectedEvent === event._id ? 'var(--primary)' : '#f9fafb',
                                                color: selectedEvent === event._id ? 'white' : '#1a1a1a',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontWeight: '500',
                                                fontSize: '14px',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div>{event.title}</div>
                                            <div style={{ 
                                                fontSize: '12px', 
                                                opacity: 0.7,
                                                marginTop: '4px'
                                            }}>
                                                📅 {new Date(event.eventDate).toLocaleDateString()}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Participants List */}
                        <div className="participants-section">
                            {selectedEventData ? (
                                <>
                                    <div style={{ 
                                        background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
                                        color: 'white',
                                        padding: '24px',
                                        borderRadius: '12px',
                                        marginBottom: '24px'
                                    }}>
                                        <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>📌 {selectedEventData.title}</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', opacity: 0.9 }}>Date</div>
                                                <div style={{ fontSize: '16px', fontWeight: '700' }}>
                                                    {new Date(selectedEventData.eventDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', opacity: 0.9 }}>Location</div>
                                                <div style={{ fontSize: '16px', fontWeight: '700' }}>
                                                    {selectedEventData.location}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', opacity: 0.9 }}>Registrations</div>
                                                <div style={{ fontSize: '16px', fontWeight: '700' }}>
                                                    {registrations.length}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                                        👥 Registered Participants ({registrations.length})
                                    </h3>

                                    {loadingRegistrations ? (
                                        <div style={{ textAlign: 'center', padding: '40px', color: '#6F767E' }}>
                                            Loading participants...
                                        </div>
                                    ) : registrations.length === 0 ? (
                                        <div style={{ 
                                            background: '#f9fafb',
                                            border: '1px solid #EFEFEF',
                                            borderRadius: '12px',
                                            padding: '40px',
                                            textAlign: 'center'
                                        }}>
                                            <p style={{ color: '#6F767E', margin: 0 }}>No participants registered yet</p>
                                        </div>
                                    ) : (
                                        <div style={{ 
                                            background: 'white',
                                            border: '1px solid #EFEFEF',
                                            borderRadius: '12px',
                                            overflow: 'auto'
                                        }}>
                                            <table style={{
                                                width: '100%',
                                                borderCollapse: 'collapse'
                                            }}>
                                                <thead>
                                                    <tr style={{ 
                                                        background: '#f9fafb',
                                                        borderBottom: '1px solid #EFEFEF'
                                                    }}>
                                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Name</th>
                                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Email</th>
                                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Phone</th>
                                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Department</th>
                                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Year</th>
                                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>College</th>
                                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Status</th>
                                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', minWidth: '100px' }}>Rating</th>
                                                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', minWidth: '120px' }}>Feedback</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {registrations.map((reg, idx) => (
                                                        <tr 
                                                            key={reg._id}
                                                            style={{ 
                                                                borderBottom: '1px solid #EFEFEF',
                                                                background: idx % 2 === 0 ? 'white' : '#fafafa'
                                                            }}
                                                        >
                                                            <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                                                <strong>{reg.firstName} {reg.lastName}</strong>
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6F767E' }}>
                                                                {reg.email}
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6F767E' }}>
                                                                {reg.phone}
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6F767E' }}>
                                                                {reg.department || '-'}
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6F767E' }}>
                                                                {reg.year || '-'}
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6F767E' }}>
                                                                {reg.college || '-'}
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                                                <span style={{
                                                                    background: reg.status === 'attended' ? '#d1fae5' : reg.status === 'accepted' ? '#dbeafe' : reg.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                                                    color: reg.status === 'attended' ? '#065f46' : reg.status === 'accepted' ? '#1e40af' : reg.status === 'rejected' ? '#991b1b' : '#92400e',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {reg.status?.charAt(0).toUpperCase() + reg.status?.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6F767E' }}>
                                                                {reg.rating ? (
                                                                    <span style={{ color: '#fbbf24', letterSpacing: '1px' }}>
                                                                        {"★".repeat(reg.rating)}{"☆".repeat(5-reg.rating)}
                                                                    </span>
                                                                ) : '-'}
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center' }}>
                                                                {reg.rating && reg.feedback ? (
                                                                    <button 
                                                                        onClick={() => setSelectedFeedback({...reg.feedback, rating: reg.rating, userName: `${reg.firstName} ${reg.lastName}`})}
                                                                        style={{
                                                                            background: 'var(--primary)', color: 'white', border: 'none', 
                                                                            padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                                                                            fontSize: '12px', fontWeight: '600'
                                                                        }}
                                                                    >
                                                                        View Feedback
                                                                    </button>
                                                                ) : '-'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ 
                                    background: '#f9fafb',
                                    border: '1px solid #EFEFEF',
                                    borderRadius: '12px',
                                    padding: '40px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#6F767E' }}>Select an event to view participants</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feedback Modal */}
                {selectedFeedback && (
                    <div className="feedback-modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                        background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
                    }}>
                        <div className="feedback-modal-content" style={{
                            background: 'white', width: '90%', maxWidth: '500px', 
                            borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                            maxHeight: '80vh', overflowY: 'auto'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#0f172a' }}>
                                    Feedback from {selectedFeedback.userName}
                                </h2>
                                <button 
                                    onClick={() => setSelectedFeedback(null)}
                                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
                                >
                                    ✕
                                </button>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Overall Rating</div>
                                <div style={{ fontSize: '24px', color: '#fbbf24', letterSpacing: '2px' }}>
                                    {"★".repeat(selectedFeedback.rating)}{"☆".repeat(5-selectedFeedback.rating)}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Event Experience</div>
                                <div style={{ fontSize: '15px', color: '#334155', lineHeight: '1.5', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    {selectedFeedback.eventExperience || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No response provided.</span>}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Areas of Dissatisfaction</div>
                                <div style={{ fontSize: '15px', color: '#334155', lineHeight: '1.5', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    {selectedFeedback.dissatisfactions || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No response provided.</span>}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Suggestions for Improvement</div>
                                <div style={{ fontSize: '15px', color: '#334155', lineHeight: '1.5', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    {selectedFeedback.improvements || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No response provided.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
