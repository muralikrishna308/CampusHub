// StudentDashboard.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './StudentDashboard.css';
import Chatbot from '../components/chatbot';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [studentRegistrations, setStudentRegistrations] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    department: '',
    year: '1st Year',
    college: '',
    phone: '',
    bio: ''
  });

  // Fetch all events
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch events
      const eventsResponse = await fetch('http://localhost:5000/api/events/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!eventsResponse.ok) throw new Error('Failed to fetch events');
      const events = await eventsResponse.json();
      setAllEvents(events);

      // Fetch profile
      const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setStudentProfile(profile);
        setProfileForm({
          department: profile.department || '',
          year: profile.year || '1st Year',
          college: profile.college || '',
          phone: profile.phone || '',
          bio: profile.bio || ''
        });
      }

      // Fetch registrations
      const registrationsResponse = await fetch('http://localhost:5000/api/registrations/my-registrations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (registrationsResponse.ok) {
        const registrations = await registrationsResponse.json();
        setStudentRegistrations(registrations);
        
        const nowDate = new Date();
        const upcoming = registrations.filter(reg => new Date(reg.event?.eventDate) > nowDate).length;
        const completed = registrations.filter(reg => new Date(reg.event?.eventDate) < nowDate).length;
        
        setStats({
          totalRegistrations: registrations.length,
          upcomingEvents: upcoming,
          completedEvents: completed,
          totalEvents: events.length,
          featuredEvents: events.slice(0, 3)
        });
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, [token]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setNotifications([
      { id: 1, type: 'event', message: 'Tech Workshop starts tomorrow', read: false, time: '2 hours ago' },
      { id: 2, type: 'registration', message: 'You registered for Music Fest 2024', read: false, time: '1 day ago' },
      { id: 3, type: 'reminder', message: 'Complete your profile to get personalized recommendations', read: false, time: '2 days ago' },
    ]);
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, [fetchDashboardData, fetchNotifications]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setStudentProfile(updatedProfile);
        setShowProfileModal(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S';
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Student Dashboard</h1>
          <div className="user-badge">
            <span className="user-avatar">
              {getInitials(studentProfile?.name || user?.name)}
            </span>
            <span className="user-info">
              <span className="user-name">{studentProfile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Student'}</span>
              <span className="user-role">Student</span>
            </span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="notification-wrapper">
            <button 
              className="btn-icon"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <h4>Notifications</h4>
                {notifications.length === 0 ? (
                  <p>No notifications</p>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <p>{notification.message}</p>
                      <small>{notification.time}</small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          <button className="btn-icon" onClick={() => setShowSettingsModal(true)}>⚙️</button>
          <button onClick={handleLogout} className="btn-logout">
            <span>🚪</span>
            Sign out
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="student-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
        className="tab-btn"
        onClick={() => navigate('/events')}
        >
            🎯 All Events
        </button>
        <button 
          className={`tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          📝 My Registrations
          {stats?.totalRegistrations > 0 && (
            <span className="tab-badge">{stats.totalRegistrations}</span>
          )}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setShowProfileModal(true)}
        >
          👤 Profile
        </button>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : stats && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Welcome Section */}
                <div className="welcome-section">
                  <h2>
                    Welcome back, {studentProfile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Student'}! 👋
                  </h2>
                  <p className="welcome-subtitle">
                    {studentProfile?.department || 'Computer Science'} • Year {studentProfile?.year || '3'} • {studentProfile?.college || 'University'}
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                  <StatCard 
                    title="Total Registrations" 
                    value={stats.totalRegistrations} 
                    icon="📝"
                    trend="Events you've joined"
                    trendType="info"
                  />
                  <StatCard 
                    title="Upcoming Events" 
                    value={stats.upcomingEvents} 
                    icon="⏰"
                    trend={stats.upcomingEvents > 0 ? `${stats.upcomingEvents} events coming up` : 'No upcoming events'}
                    trendType={stats.upcomingEvents > 0 ? 'positive' : 'neutral'}
                  />
                  <StatCard 
                    title="Completed Events" 
                    value={stats.completedEvents} 
                    icon="✅"
                    trend="Events attended"
                    trendType="info"
                  />
                  <StatCard 
                    title="Total Events" 
                    value={stats.totalEvents} 
                    icon="🎯"
                    trend="Available on platform"
                    trendType="info"
                  />
                </div>

                {/* Featured Events */}
                <div className="featured-events-section">
                  <div className="section-header">
                    <h2>🎯 Featured Events</h2>
                    <button 
                      className="view-all-btn"
                      onClick={() => navigate('/events')}
                    >
                      View All Events →
                    </button>
                  </div>

                  {stats.featuredEvents?.length === 0 ? (
                    <div className="empty-state">
                      <p>No events available right now. Check back soon!</p>
                    </div>
                  ) : (
                    <div className="featured-grid">
                      {stats.featuredEvents?.map(event => (
                        <FeaturedEventCard
                        key={event._id}
                        event={event}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Registrations */}
                {studentRegistrations.length > 0 && (
                  <div className="recent-registrations-section">
                    <div className="section-header">
                      <h2>📝 Recent Registrations</h2>
                      <button 
                        className="view-all-btn"
                        onClick={() => setActiveTab('registrations')}
                      >
                        View All →
                      </button>
                    </div>

                    <div className="registrations-list">
                      {studentRegistrations.slice(0, 3).map(reg => (
                        <RegistrationCard
                          key={reg._id}
                          registration={reg}
                          onClick={() => navigate(`/events/${reg.event?._id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="events-tab">
                <div className="tab-header">
                  <h2>All Events</h2>
                  <div className="tab-actions">
                    <input 
                      type="text" 
                      placeholder="Search events..." 
                      className="search-input"
                    />
                    <select className="filter-select">
                      <option>All Categories</option>
                      <option>Technology</option>
                      <option>Sports</option>
                      <option>Cultural</option>
                      <option>Gaming</option>
                    </select>
                  </div>
                </div>

                <div className="events-grid">
                  {allEvents.map(event => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onClick={() => navigate(`/events/${event._id}`)}
                      isRegistered={studentRegistrations.some(r => r.event?._id === event._id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Registrations Tab */}
            {activeTab === 'registrations' && (
              <div className="registrations-tab">
                <div className="tab-header">
                  <h2>My Registrations</h2>
                  <div className="tab-actions">
                    <select className="filter-select">
                      <option>All Status</option>
                      <option>Upcoming</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>

                {studentRegistrations.length === 0 ? (
                  <div className="empty-state">
                    <p>You haven't registered for any events yet.</p>
                    <button 
                      className="btn-primary"
                      onClick={() => navigate('/events')}
                    >
                      Browse Events
                    </button>
                  </div>
                ) : (
                  <div className="registrations-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Event</th>
                          <th>Date</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Registered On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentRegistrations.map(reg => (
                          <tr key={reg._id}>
                            <td>
                              <div className="event-cell">
                                {reg.event?.image ? (
                                  <img 
                                    src={`http://localhost:5000/uploads/${reg.event.image}`}
                                    alt={reg.event.title}
                                  />
                                ) : (
                                  <div className="event-icon">
                                    {reg.event?.category === 'Technology' ? '💻' : 
                                     reg.event?.category === 'Sports' ? '🏆' : 
                                     reg.event?.category === 'Cultural' ? '🎭' : '📅'}
                                  </div>
                                )}
                                <span>{reg.event?.title}</span>
                              </div>
                            </td>
                            <td>{new Date(reg.event?.eventDate).toLocaleDateString()}</td>
                            <td>{reg.event?.location}</td>
                            <td>
                              <span className={`status-badge ${reg.status?.toLowerCase() || 'registered'}`}>
                                {reg.status || 'Registered'}
                              </span>
                            </td>
                            <td>{new Date(reg.registeredAt || reg.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button 
                                className="action-btn"
                                onClick={() => navigate(`/events/${reg.event?._id}`)}
                              >
                                👁️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProfileModal(false)}>×</button>
            <h2>Edit Profile</h2>
            
            <form onSubmit={handleProfileUpdate} className="modal-form">
              <div className="form-group">
                <label>Department</label>
                <input 
                  type="text" 
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div className="form-group">
                <label>Year</label>
                <select
                  value={profileForm.year}
                  onChange={(e) => setProfileForm({...profileForm, year: e.target.value})}
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>

              <div className="form-group">
                <label>College</label>
                <input 
                  type="text" 
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({...profileForm, college: e.target.value})}
                  placeholder="Your college name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  placeholder="Your contact number"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea 
                  rows="3"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  placeholder="Tell us a bit about yourself"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSettingsModal(false)}>×</button>
            <h2>Settings</h2>
            
            <div className="settings-content">
              <div className="setting-item">
                <label>
                  <input type="checkbox" /> Email notifications for upcoming events
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" /> SMS reminders (24 hours before event)
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" /> Public profile
                </label>
              </div>
              <div className="setting-item">
                <label>Language preference</label>
                <select defaultValue="en">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-primary">Save Settings</button>
              <button className="btn-secondary" onClick={() => setShowSettingsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, trend, trendType = 'info', onClick }) {
  return (
    <div 
      className={`stat-card ${onClick ? 'clickable' : ''}`} 
      onClick={onClick}
    >
      <div className="stat-card-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-card-body">
        <span className="stat-main-value">{value}</span>
        {trend && (
          <span className={`stat-trend ${trendType}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

// Featured Event Card Component
function FeaturedEventCard({ event, onClick }) {
  return (
    <div className="featured-card">
      <div className="featured-card-image">
        {event.image ? (
          <img src={`http://localhost:5000/uploads/${event.image}`} alt={event.title} />
        ) : (
          <div className="image-placeholder">
            {event.category === 'Technology' ? '💻' : 
             event.category === 'Sports' ? '🏆' : 
             event.category === 'Cultural' ? '🎭' : 
             event.category === 'Gaming' ? '🎮' : '📅'}
          </div>
        )}
      </div>
      <div className="featured-card-content">
        <h3 className="featured-card-title">{event.title}</h3>
        <p className="featured-card-description">
          {event.description?.substring(0, 60)}...
        </p>
        <div className="featured-card-footer">
          <span className="featured-card-date">
            📅 {new Date(event.eventDate).toLocaleDateString()}
          </span>
          <span className="featured-card-location">
            📍 {event.location}
          </span>
        </div>
      </div>
    </div>
  );
}

// Regular Event Card Component
function EventCard({ event, onClick, isRegistered }) {
  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-image-container">
        {event.image ? (
          <img src={`http://localhost:5000/uploads/${event.image}`} alt={event.title} />
        ) : (
          <div className="event-icon-large">
            {event.category === 'Technology' ? '💻' : 
             event.category === 'Sports' ? '🏆' : 
             event.category === 'Cultural' ? '🎭' : 
             event.category === 'Gaming' ? '🎮' : '📅'}
          </div>
        )}
        {isRegistered && (
          <span className="registered-badge">Registered</span>
        )}
      </div>
      
      <div className="event-details">
        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-meta">
          <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
          <span>📍 {event.location}</span>
        </div>

        <p className="event-description">
          {event.description?.substring(0, 80)}...
        </p>

        <div className="event-footer">
          <span className="event-price">
            {event.ticketPrice > 0 ? `$${event.ticketPrice}` : 'Free'}
          </span>
          <button className="btn-view">View Details →</button>
        </div>
      </div>
    </div>
  );
}

// Registration Card Component
function RegistrationCard({ registration, onClick }) {
  const event = registration.event;
  
  return (
    <div className="registration-card" onClick={onClick}>
      <div className="registration-card-image">
        {event?.image ? (
          <img src={`http://localhost:5000/uploads/${event.image}`} alt={event.title} />
        ) : (
          <div className="image-placeholder">
            {event?.category === 'Technology' ? '💻' : 
             event?.category === 'Sports' ? '🏆' : 
             event?.category === 'Cultural' ? '🎭' : '📅'}
          </div>
        )}
      </div>
      <div className="registration-card-content">
        <h4 className="registration-card-title">{event?.title}</h4>
        <p className="registration-card-description">
          {event?.description?.substring(0, 50)}...
        </p>
        <div className="registration-card-footer">
          <span className="registration-card-date">
            📅 {new Date(event?.eventDate).toLocaleDateString()}
          </span>
          <span className={`status-badge ${registration.status?.toLowerCase() || 'registered'}`}>
            {registration.status || 'Registered'}
          </span>
        </div>
      </div>
    </div>
  );
}