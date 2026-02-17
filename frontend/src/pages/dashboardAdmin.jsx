import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css'; // We'll create this CSS file
import Chatbot from '../components/chatbot';

// Import actual images (you can replace these URLs with your actual image paths)
const eventImages = {
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  music: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  networking: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  charity: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
};

export default function AdminDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    
    // Simulate API call with enhanced dummy data including image URLs
    setTimeout(() => {
      setStats({
        totalEvents: 24,
        activeEvents: 8,
        totalRegistrations: 1250,
        avgParticipants: 52,
        recentEvents: [
          { 
            _id: 1, 
            title: 'Tech Conference 2024', 
            participants: 245, 
            active: true,
            image: eventImages.tech,
            date: '2024-03-15',
            location: 'Convention Center',
            category: 'Technology',
            revenue: 12500
          },
          { 
            _id: 2, 
            title: 'Music Festival', 
            participants: 189, 
            active: true,
            image: eventImages.music,
            date: '2024-03-20',
            location: 'Central Park',
            category: 'Music',
            revenue: 8900
          },
          { 
            _id: 3, 
            title: 'Workshop: React Basics', 
            participants: 78, 
            active: false,
            image: eventImages.workshop,
            date: '2024-02-28',
            location: 'Online',
            category: 'Education',
            revenue: 3900
          },
          { 
            _id: 4, 
            title: 'Networking Mixer', 
            participants: 156, 
            active: true,
            image: eventImages.networking,
            date: '2024-03-25',
            location: 'Business Center',
            category: 'Networking',
            revenue: 6200
          },
          { 
            _id: 5, 
            title: 'Charity Run', 
            participants: 320, 
            active: true,
            image: eventImages.charity,
            date: '2024-04-01',
            location: 'City Stadium',
            category: 'Charity',
            revenue: 15000
          },
        ]
      });
      setLoading(false);
    }, 1000);

    // Original fetch call (commented out for demo)
    /*
    fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/dashboard/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
    */
  }, [token]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setShowCreateModal(false);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <div className="user-badge">
            <span className="user-avatar">
              {user?.name?.[0] || user?.email?.[0] || 'A'}
            </span>
            <span className="user-info">
              <span className="user-name">{user?.name || user?.email}</span>
              <span className="user-role">{user?.role}</span>
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

      {/* Main Content */}
      <main className="dashboard-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard statistics...</p>
          </div>
        ) : stats && (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <Card 
                title="Total Events" 
                value={stats.totalEvents} 
                icon="📅"
                trend="+12% from last month"
                color="#4f46e5"
              />
              <Card 
                title="Active Events" 
                value={stats.activeEvents} 
                icon="🔥"
                trend="3 ending soon"
                color="#ea580c"
              />
              <Card 
                title="Total Registrations" 
                value={stats.totalRegistrations} 
                icon="👥"
                trend="+245 this week"
                color="#16a34a"
              />
              <Card 
                title="Avg Participants" 
                value={stats.avgParticipants} 
                icon="📊"
                trend="per event"
                color="#9333ea"
              />
            </div>

            {/* Recent Events with Images */}
            <div className="recent-events-section">
              <div className="section-header">
                <h2>Recent Events</h2>
                <div className="header-actions">
                  <button className="btn-secondary">
                    <span>📊</span>
                    Export Report
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <span>➕</span>
                    Create New Event
                  </button>
                </div>
              </div>

              {stats.recentEvents.length === 0 ? (
                <div className="empty-state">
                  <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="No events" />
                  <p>No recent events found</p>
                  <button className="btn-primary">Create Your First Event</button>
                </div>
              ) : (
                <div className="events-grid">
                  {stats.recentEvents.map(event => (
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
                        <span className={`event-status ${event.active ? 'active' : 'inactive'}`}>
                          {event.active ? 'Active' : 'Inactive'}
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
                          <span className="event-location">
                            📍 {event.location}
                          </span>
                        </div>

                        <div className="event-stats">
                          <div className="stat">
                            <span className="stat-label">Participants</span>
                            <span className="stat-value">{event.participants}</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Revenue</span>
                            <span className="stat-value">${event.revenue?.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="event-actions">
                          <button className="btn-edit">✏️ Edit</button>
                          <button className="btn-view">👁️ View</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Sidebar */}
            <div className="quick-actions-sidebar">
              <h3>Quick Actions</h3>
              <div className="actions-list">
                <button className="action-item">
                  <span className="action-icon">📋</span>
                  <div className="action-content">
                    <strong>Create New Event</strong>
                    <small>Start planning your next event</small>
                  </div>
                </button>
                <button className="action-item">
                  <span className="action-icon">📊</span>
                  <div className="action-content">
                    <strong>Generate Report</strong>
                    <small>Export event analytics</small>
                  </div>
                </button>
                <button className="action-item">
                  <span className="action-icon">👥</span>
                  <div className="action-content">
                    <strong>Manage Users</strong>
                    <small>View and edit user permissions</small>
                  </div>
                </button>
                <button className="action-item">
                  <span className="action-icon">⚙️</span>
                  <div className="action-content">
                    <strong>Settings</strong>
                    <small>Configure dashboard preferences</small>
                  </div>
                </button>
              </div>

              <div className="recent-activity">
                <h4>Recent Activity</h4>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-dot"></span>
                    <div className="activity-content">
                      <p>New registration for Tech Conference</p>
                      <small>2 minutes ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-dot"></span>
                    <div className="activity-content">
                      <p>Event "Music Festival" reached capacity</p>
                      <small>1 hour ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-dot"></span>
                    <div className="activity-content">
                      <p>New user registered: Sarah Johnson</p>
                      <small>3 hours ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Event Detail Modal */}
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
                  <span>📍 {selectedEvent.location}</span>
                  <span>🏷️ {selectedEvent.category}</span>
                </div>
                <div className="modal-stats">
                  <div className="modal-stat">
                    <label>Participants</label>
                    <span>{selectedEvent.participants}</span>
                  </div>
                  <div className="modal-stat">
                    <label>Revenue</label>
                    <span>${selectedEvent.revenue?.toLocaleString()}</span>
                  </div>
                  <div className="modal-stat">
                    <label>Status</label>
                    <span className={`status-badge ${selectedEvent.active ? 'active' : 'inactive'}`}>
                      {selectedEvent.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn-primary">Edit Event</button>
                  <button className="btn-secondary">View Registrations</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content create-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>Create New Event</h2>
            <form className="create-form">
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" placeholder="Enter event title" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select>
                  <option>Technology</option>
                  <option>Music</option>
                  <option>Education</option>
                  <option>Networking</option>
                  <option>Charity</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" placeholder="Venue or Online" />
                </div>
              </div>
              <div className="form-group">
                <label>Event Image</label>
                <input type="file" accept="image/*" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="4" placeholder="Describe your event..."></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Chatbot />
    </div>
  );
}

// Enhanced Card Component with icons and trends
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