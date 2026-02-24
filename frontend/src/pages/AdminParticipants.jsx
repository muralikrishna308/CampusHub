import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [adminEvents, setAdminEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);

    // Fetch admin's events
    useEffect(() => {
        const fetchEvents = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/admin/events', {
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
                    `http://localhost:5000/api/registrations/event/${selectedEvent}`,
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
                <Sidebar role="admin" />
                <main className="main-content">
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar role="admin" />
            <main className="main-content">
                <Header userName={user?.name || "Admin"} userRole="Admin" id={user?.id} />

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
                                            overflow: 'hidden'
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
                                                                    background: reg.status === 'attended' ? '#d1fae5' : '#dbeafe',
                                                                    color: reg.status === 'attended' ? '#065f46' : '#0c4a6e',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {reg.status?.charAt(0).toUpperCase() + reg.status?.slice(1)}
                                                                </span>
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
            </main>
        </div>
    );
}
