// StudentDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './StudentDashboard.css'; // Using the same CSS but with minor additions

// Same image imports as admin
const eventImages = {
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  music: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  networking: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  charity: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
};

export default function StudentDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    
    // Simulate API call with student-specific data
    setTimeout(() => {
      setStats({
        totalEvents: 24,
        registeredCount: 3,
        attendedCount: 1,
        upcomingCount: 2,
        recommendations: 8,
        myEvents: [
          { 
            _id: 1, 
            title: 'Tech Conference 2024', 
            participants: 245, 
            status: 'registered',
            image: eventImages.tech,
            date: '2024-03-15',
            location: 'Convention Center',
            category: 'Technology',
            time: '10:00 AM',
            registeredDate: '2024-02-01'
          },
          { 
            _id: 2, 
            title: 'Music Festival', 
            participants: 189, 
            status: 'attended',
            image: eventImages.music,
            date: '2024-02-20',
            location: 'Central Park',
            category: 'Music',
            time: '4:00 PM',
            registeredDate: '2024-01-15'
          },
          { 
            _id: 3, 
            title: 'Workshop: React Basics', 
            participants: 78, 
            status: 'registered',
            image: eventImages.workshop,
            date: '2024-03-28',
            location: 'Online',
            category: 'Education',
            time: '2:00 PM',
            registeredDate: '2024-02-10'
          },
        ],
        availableEvents: [
          { 
            _id: 4, 
            title: 'Networking Mixer', 
            participants: 156, 
            capacity: 200,
            registered: 156,
            image: eventImages.networking,
            date: '2024-03-25',
            location: 'Business Center',
            category: 'Networking',
            time: '6:30 PM',
            description: 'Connect with industry professionals'
          },
          { 
            _id: 5, 
            title: 'Charity Run', 
            participants: 320, 
            capacity: 500,
            registered: 320,
            image: eventImages.charity,
            date: '2024-04-01',
            location: 'City Stadium',
            category: 'Charity',
            time: '8:00 AM',
            description: 'Run for a cause'
          },
          { 
            _id: 6, 
            title: 'AI Summit', 
            participants: 120, 
            capacity: 300,
            registered: 120,
            image: eventImages.tech,
            date: '2024-04-05',
            location: 'Tech Park',
            category: 'Technology',
            time: '9:00 AM',
            description: 'Future of AI'
          },
        ]
      });
      setLoading(false);
    }, 1000);
  }, [token]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleRegister = (eventId) => {
    // Handle registration logic
    alert('Successfully registered for the event! Check your email for confirmation.');
    setShowRegisterModal(false);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setShowRegisterModal(false);
  };

  return (
    <div className="admin-dashboard"> {/* Using same class for consistent styling */}
      
      {/* Header - Same as admin but with student info */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Student Dashboard</h1>
          <div className="user-badge">
            <span className="user-avatar">
              {user?.name?.[0] || user?.email?.[0] || 'S'}
            </span>
            <span className="user-info">
              <span className="user-name">{user?.name || user?.email}</span>
              <span className="user-role">Student</span>
            </span>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-icon">
            <span className="notification-dot"></span>
            🔔
          </button>
          <button className="btn-icon">⚙️</button>
          <button onClick={logout} className="btn-logout">
            <span>🚪</span>
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content - Same layout as admin */}
      <main className="dashboard-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : stats && (
          <>
            {/* Stats Cards - Student specific stats */}
            <div className="stats-grid">
              <Card 
                title="My Events" 
                value={stats.registeredCount} 
                icon="📋"
                trend="Registered events"
                color="#4f46e5"
              />
              <Card 
                title="Attended" 
                value={stats.attendedCount} 
                icon="✅"
                trend="Completed"
                color="#16a34a"
              />
              <Card 
                title="Upcoming" 
                value={stats.upcomingCount} 
                icon="📅"
                trend="Next 7 days"
                color="#ea580c"
              />
              <Card 
                title="Recommendations" 
                value={stats.recommendations} 
                icon="🎯"
                trend="For you"
                color="#9333ea"
              />
            </div>

            {/* My Registered Events - Same card style as admin */}
            <div className="recent-events-section">
              <div className="section-header">
                <h2>My Registered Events</h2>
                <div className="header-actions">
                  <button className="btn-secondary">
                    <span>📅</span>
                    Calendar View
                  </button>
                  <button className="btn-primary">
                    <span>🔍</span>
                    Browse Events
                  </button>
                </div>
              </div>

              {stats.myEvents.length === 0 ? (
                <div className="empty-state">
                  <img src={eventImages.default} alt="No events" />
                  <p>You haven't registered for any events yet</p>
                  <button className="btn-primary">Browse Events</button>
                </div>
              ) : (
                <div className="events-grid">
                  {stats.myEvents.map(event => (
                    <div 
                      key={event._id} 
                      className="event-card"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="event-image-container">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="event-image"
                          loading="lazy"
                        />
                        <span className={`event-status ${event.status}`}>
                          {event.status}
                        </span>
                        <span className="event-category">{event.category}</span>
                      </div>
                      
                      <div className="event-details">
                        <h3 className="event-title">{event.title}</h3>
                        
                        <div className="event-meta">
                          <span className="event-date">
                            📅 {new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="event-time">
                            🕒 {event.time}
                          </span>
                          <span className="event-location">
                            📍 {event.location}
                          </span>
                        </div>

                        <div className="event-stats">
                          <div className="stat">
                            <span className="stat-label">Registered</span>
                            <span className="stat-value">{event.registeredDate}</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Participants</span>
                            <span className="stat-value">{event.participants}</span>
                          </div>
                        </div>

                        <div className="event-actions">
                          <button className="btn-view">📋 Details</button>
                          <button className="btn-edit">📅 Add to Calendar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Events - Same style as admin recent events */}
            <div className="recent-events-section" style={{ marginTop: '2rem' }}>
              <div className="section-header">
                <h2>Recommended For You</h2>
                <div className="header-actions">
                  <button className="btn-secondary">
                    <span>🔍</span>
                    Search
                  </button>
                  <button className="btn-secondary">
                    <span>⚡</span>
                    Trending
                  </button>
                </div>
              </div>

              <div className="events-grid">
                {stats.availableEvents.map(event => (
                  <div 
                    key={event._id} 
                    className="event-card"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowRegisterModal(true);
                    }}
                  >
                    <div className="event-image-container">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="event-image"
                        loading="lazy"
                      />
                      <span className="event-category">{event.category}</span>
                      <span className="event-status" style={{ background: '#4f46e5', color: 'white' }}>
                        Available
                      </span>
                    </div>
                    
                    <div className="event-details">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-description" style={{ 
                        fontSize: '0.9rem', 
                        color: '#666',
                        margin: '0.5rem 0'
                      }}>
                        {event.description}
                      </p>
                      
                      <div className="event-meta">
                        <span className="event-date">
                          📅 {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="event-time">
                          🕒 {event.time}
                        </span>
                        <span className="event-location">
                          📍 {event.location}
                        </span>
                      </div>

                      <div className="event-stats">
                        <div className="stat">
                          <span className="stat-label">Registered</span>
                          <span className="stat-value">{event.registered}/{event.capacity}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Availability</span>
                          <span className="stat-value">
                            {event.capacity - event.registered} spots
                          </span>
                        </div>
                      </div>

                      <div className="event-actions">
                        <button 
                          className="btn-primary" 
                          style={{ width: '100%' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setShowRegisterModal(true);
                          }}
                        >
                          Register Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Sidebar - Student specific */}
            <div className="quick-actions-sidebar">
              <h3>Student Tools</h3>
              <div className="actions-list">
                <button className="action-item">
                  <span className="action-icon">📅</span>
                  <div className="action-content">
                    <strong>My Calendar</strong>
                    <small>View your schedule</small>
                  </div>
                </button>
                <button className="action-item">
                  <span className="action-icon">🎫</span>
                  <div className="action-content">
                    <strong>My Tickets</strong>
                    <small>View all tickets</small>
                  </div>
                </button>
                <button className="action-item">
                  <span className="action-icon">⭐</span>
                  <div className="action-content">
                    <strong>Saved Events</strong>
                    <small>3 saved events</small>
                  </div>
                </button>
                <button className="action-item">
                  <span className="action-icon">📊</span>
                  <div className="action-content">
                    <strong>My Stats</strong>
                    <small>Event history</small>
                  </div>
                </button>
              </div>

              <div className="recent-activity">
                <h4>Upcoming This Week</h4>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-dot" style={{ background: '#4f46e5' }}></span>
                    <div className="activity-content">
                      <p>Tech Conference 2024</p>
                      <small>Tomorrow at 10:00 AM</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-dot" style={{ background: '#16a34a' }}></span>
                    <div className="activity-content">
                      <p>Networking Mixer</p>
                      <small>Mar 25 at 6:30 PM</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Event Detail Modal - Same as admin but with student actions */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-body">
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title}
                className="modal-image"
              />
              <div className="modal-details">
                <h2>{selectedEvent.title}</h2>
                <div className="modal-meta">
                  <span>📅 {selectedEvent.date}</span>
                  <span>🕒 {selectedEvent.time}</span>
                  <span>📍 {selectedEvent.location}</span>
                  <span>🏷️ {selectedEvent.category}</span>
                </div>
                <p style={{ color: '#666', margin: '1rem 0' }}>
                  {selectedEvent.description || 'No description available'}
                </p>
                <div className="modal-stats">
                  <div className="modal-stat">
                    <label>Participants</label>
                    <span>{selectedEvent.participants || selectedEvent.registered}</span>
                  </div>
                  {selectedEvent.capacity && (
                    <div className="modal-stat">
                      <label>Capacity</label>
                      <span>{selectedEvent.capacity}</span>
                    </div>
                  )}
                  {selectedEvent.status && (
                    <div className="modal-stat">
                      <label>Status</label>
                      <span className={`status-badge ${selectedEvent.status}`}>
                        {selectedEvent.status}
                      </span>
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  {!selectedEvent.status && (
                    <button 
                      className="btn-primary" 
                      onClick={() => handleRegister(selectedEvent._id)}
                    >
                      Register Now
                    </button>
                  )}
                  <button className="btn-secondary">Add to Calendar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎟️</div>
              <h2>Confirm Registration</h2>
              <p style={{ color: '#666', margin: '1rem 0' }}>
                You're about to register for:<br />
                <strong>{selectedEvent.title}</strong>
              </p>
              <div style={{ 
                background: '#f9fafb', 
                padding: '1rem', 
                borderRadius: '8px',
                margin: '1.5rem 0',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Date:</span>
                  <strong>{selectedEvent.date}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Time:</span>
                  <strong>{selectedEvent.time}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Location:</span>
                  <strong>{selectedEvent.location}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1 }}
                  onClick={() => handleRegister(selectedEvent._id)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusing the same Card component from admin
function Card({ title, value, icon, trend, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="stat-card-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-card-body">
        <span className="stat-main-value">{value}</span>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
    </div>
  );
}