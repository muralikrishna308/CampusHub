import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import Chatbot from '../components/Chatbot';

const eventImages = {
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  music: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
  workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
  cultural: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
  default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
};

export default function StudentDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Browse events state
  const [showBrowseEvents, setShowBrowseEvents] = useState(false);
  const [browseEvents, setBrowseEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [browseLoading, setBrowseLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    year: user?.year || ''
  });

  // Categories for browse events
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'tech', name: 'Technology' },
    { id: 'music', name: 'Music' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'sports', name: 'Sports' }
  ];

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        setDashboard({
          enrolledEvents: 5,
          upcomingEvents: 3,
          certificates: 2,
          profileCompletion: 78,
          totalHours: 24,
          upcomingEventsList: [
            {
              _id: 1,
              title: 'Tech Conference 2024',
              date: '2024-03-15',
              location: 'Convention Center',
              image: eventImages.tech,
              status: 'Upcoming',
              description: 'Annual technology conference featuring latest trends',
              speaker: 'John Doe',
              registeredAt: '2024-01-10'
            },
            {
              _id: 2,
              title: 'Music Festival',
              date: '2024-03-20',
              location: 'Central Park',
              image: eventImages.music,
              status: 'Upcoming',
              description: 'Annual music festival with multiple artists',
              speaker: 'Jane Smith',
              registeredAt: '2024-01-15'
            },
            {
              _id: 3,
              title: 'Workshop: React Basics',
              date: '2024-02-10',
              location: 'Online',
              image: eventImages.workshop,
              status: 'Completed',
              description: 'Learn React fundamentals',
              speaker: 'Mike Johnson',
              completedAt: '2024-02-10',
              certificateId: 'CERT-2024-001'
            }
          ],
          certificatesList: [
            {
              id: 'CERT-2024-001',
              title: 'React Basics Workshop',
              issueDate: '2024-02-10',
              grade: 'A',
              downloadUrl: '/certificates/react-basics.pdf'
            },
            {
              id: 'CERT-2024-002',
              title: 'Tech Conference 2024',
              issueDate: '2024-03-16',
              grade: 'A+',
              downloadUrl: '/certificates/tech-conf.pdf'
            }
          ]
        });
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to load dashboard');
      setLoading(false);
    }
  }, [token]);

  // Fetch browse events
  const fetchBrowseEvents = useCallback(() => {
    setBrowseLoading(true);
    
    setTimeout(() => {
      const mockEvents = [
        {
          _id: 1,
          title: 'Tech Conference 2024',
          description: 'Annual technology conference featuring latest trends in AI, Web Development, and Cloud Computing.',
          date: '2024-03-15',
          time: '09:00 AM - 06:00 PM',
          location: 'Convention Center, Hall A',
          category: 'tech',
          image: eventImages.tech,
          speaker: 'Dr. Sarah Johnson',
          capacity: 500,
          registered: 342,
          price: 'Free'
        },
        {
          _id: 2,
          title: 'Summer Music Festival',
          description: 'A day filled with amazing performances from top artists.',
          date: '2024-03-20',
          time: '12:00 PM - 11:00 PM',
          location: 'Central Park, Main Stage',
          category: 'music',
          image: eventImages.music,
          speaker: 'Various Artists',
          capacity: 2000,
          registered: 1450,
          price: '$25'
        },
        {
          _id: 3,
          title: 'React Advanced Workshop',
          description: 'Deep dive into React hooks, context API, and performance optimization.',
          date: '2024-03-25',
          time: '10:00 AM - 04:00 PM',
          location: 'Online (Zoom)',
          category: 'workshop',
          image: eventImages.workshop,
          speaker: 'Mike Chen',
          capacity: 100,
          registered: 78,
          price: '$50'
        },
        {
          _id: 4,
          title: 'Cultural Night 2024',
          description: 'Celebrate diversity with music, dance, and food from around the world.',
          date: '2024-04-05',
          time: '06:00 PM - 10:00 PM',
          location: 'City Auditorium',
          category: 'cultural',
          image: eventImages.cultural,
          speaker: 'Cultural Society',
          capacity: 800,
          registered: 320,
          price: '$15'
        },
        {
          _id: 5,
          title: 'Basketball Tournament',
          description: 'Annual inter-college basketball tournament.',
          date: '2024-04-10',
          time: '08:00 AM - 06:00 PM',
          location: 'Sports Complex',
          category: 'sports',
          image: eventImages.sports,
          speaker: 'Sports Department',
          capacity: 16,
          registered: 12,
          price: '$100 per team'
        },
        {
          _id: 6,
          title: 'Startup Pitch Competition',
          description: 'Showcase your startup idea to investors.',
          date: '2024-03-18',
          time: '02:00 PM - 06:00 PM',
          location: 'Innovation Hub',
          category: 'tech',
          image: eventImages.tech,
          speaker: 'Venture Capitalists',
          capacity: 50,
          registered: 35,
          price: 'Free'
        }
      ];
      
      setBrowseEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setBrowseLoading(false);
    }, 500);
  }, []);

  // Handle browse events open
  const handleOpenBrowseEvents = () => {
    setShowBrowseEvents(true);
    fetchBrowseEvents();
  };

  // Handle browse events close
  const handleCloseBrowseEvents = () => {
    setShowBrowseEvents(false);
    setSearchTerm('');
    setSelectedCategory('all');
  };

  // Filter browse events
  useEffect(() => {
    if (!browseEvents.length) return;

    let filtered = browseEvents;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, browseEvents]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    try {
      setNotifications([
        {
          id: 1,
          type: 'event',
          message: 'Tech Conference starts in 2 days',
          read: false,
          createdAt: '2024-03-13T10:00:00Z'
        },
        {
          id: 2,
          type: 'certificate',
          message: 'New certificate available: React Workshop',
          read: false,
          createdAt: '2024-02-11T10:00:00Z'
        },
        {
          id: 3,
          type: 'reminder',
          message: 'Complete your profile for better recommendations',
          read: true,
          createdAt: '2024-03-10T10:00:00Z'
        }
      ]);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, [fetchDashboardData, fetchNotifications]);

  const handleRegisterEvent = async (eventId) => {
    try {
      alert('Successfully registered for event!');
      fetchDashboardData();
      setShowRegisterModal(false);
      setSelectedEvent(null);
      setShowBrowseEvents(false);
    } catch (err) {
      alert('Registration failed');
    }
  };

  const handleUnregisterEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to unregister from this event?')) return;

    try {
      alert('Successfully unregistered from event');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to unregister');
    }
  };

  const handleDownloadCertificate = async (certificate) => {
    try {
      alert(`Downloading certificate: ${certificate.title}`);
    } catch (err) {
      alert('Failed to download certificate');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      alert('Profile updated successfully!');
      setShowProfileModal(false);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getCategoryColor = (category) => {
    const colors = {
      tech: '#4f46e5',
      music: '#db2777',
      workshop: '#ea580c',
      cultural: '#16a34a',
      sports: '#dc2626'
    };
    return colors[category] || '#6b7280';
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="btn-primary">
          Retry
        </button>
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
              {user?.name?.[0] || user?.email?.[0] || 'S'}
            </span>
            <span className="user-info">
              <span className="user-name">{user?.name || user?.email}</span>
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
                      <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          <button onClick={handleLogout} className="btn-logout">Sign out</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : dashboard && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard 
                title="Enrolled Events" 
                value={dashboard.enrolledEvents} 
                icon="📚"
                onClick={() => document.getElementById('your-events')?.scrollIntoView({ behavior: 'smooth' })}
              />
              <StatCard 
                title="Upcoming Events" 
                value={dashboard.upcomingEvents} 
                icon="⏳"
                onClick={() => document.getElementById('upcoming-events')?.scrollIntoView({ behavior: 'smooth' })}
              />
              <StatCard 
                title="Certificates" 
                value={dashboard.certificates} 
                icon="🏆"
                onClick={() => setShowCertificateModal(true)}
              />
              <StatCard 
                title="Total Hours" 
                value={dashboard.totalHours || 0} 
                icon="📊"
              />
            </div>

            {/* Main Content Area */}
            <div className="main-content">
              {/* Your Events */}
              <section id="your-events" className="events-section">
                <div className="section-header">
                  <h2>Your Events</h2>
                  <button 
                    className="btn-secondary"
                    onClick={handleOpenBrowseEvents}
                  >
                    Browse More Events
                  </button>
                </div>

                <div className="events-grid">
                  {dashboard.upcomingEventsList?.map(event => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                      onUnregister={event.status === 'Upcoming' ? () => handleUnregisterEvent(event._id) : null}
                    />
                  ))}
                </div>
              </section>

              {/* Recent Certificates */}
              <section className="certificates-preview">
                <h3>Recent Certificates</h3>
                <div className="certificates-list">
                  {dashboard.certificatesList?.slice(0, 3).map(cert => (
                    <div key={cert.id} className="certificate-item">
                      <span className="cert-icon">🏆</span>
                      <div className="cert-info">
                        <h4>{cert.title}</h4>
                        <p>Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                      <button 
                        className="btn-download"
                        onClick={() => handleDownloadCertificate(cert)}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              <h3>Quick Actions</h3>

              <button 
                className="sidebar-btn"
                onClick={handleOpenBrowseEvents}
              >
                Browse Events
              </button>
              
              <button 
                className="sidebar-btn"
                onClick={() => setShowCertificateModal(true)}
              >
                My Certificates
              </button>
              
              <button 
                className="sidebar-btn"
                onClick={() => setShowProfileModal(true)}
              >
                Edit Profile
              </button>

              <div className="progress-box">
                <h4>Profile Strength</h4>
                <div className="progress-bar">
                  <div style={{ width: `${dashboard.profileCompletion}%` }}></div>
                </div>
                <small>{dashboard.profileCompletion}% completed</small>
                
                {dashboard.profileCompletion < 100 && (
                  <button 
                    className="btn-improve"
                    onClick={() => setShowProfileModal(true)}
                  >
                    Improve Profile
                  </button>
                )}
              </div>

              <div className="upcoming-deadlines">
                <h4>Upcoming Deadlines</h4>
                {dashboard.upcomingEventsList?.filter(e => e.status === 'Upcoming').map(event => (
                  <div key={event._id} className="deadline-item">
                    <span className="deadline-date">
                      {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="deadline-title">{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Browse Events Floating Panel */}
      {showBrowseEvents && (
        <div className="browse-overlay">
          <div className="browse-panel">
            <div className="browse-header">
              <h2>Browse Events</h2>
              <button className="close-btn" onClick={handleCloseBrowseEvents}>×</button>
            </div>

            <div className="browse-search">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="browse-categories">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="browse-results">
              <div className="results-count">
                Found {filteredEvents.length} events
              </div>

              {browseLoading ? (
                <div className="browse-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading events...</p>
                </div>
              ) : (
                <div className="browse-events-list">
                  {filteredEvents.map(event => (
                    <div key={event._id} className="browse-event-item">
                      <img src={event.image} alt={event.title} />
                      <div className="browse-event-info">
                        <h4>{event.title}</h4>
                        <p className="browse-event-desc">{event.description.substring(0, 80)}...</p>
                        <div className="browse-event-meta">
                          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                          <span>📍 {event.location}</span>
                        </div>
                        <div className="browse-event-footer">
                          <span className="event-price">{event.price}</span>
                          <span className="event-capacity">👥 {event.registered}/{event.capacity}</span>
                          <button 
                            className="register-small"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowRegisterModal(true);
                            }}
                          >
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && !showRegisterModal && !showBrowseEvents && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>×</button>

            <img src={selectedEvent.image} alt={selectedEvent.title} />

            <div className="modal-details">
              <h2>{selectedEvent.title}</h2>
              <p className="event-description">{selectedEvent.description}</p>
              
              <div className="event-info">
                <p><strong>📅 Date:</strong> {new Date(selectedEvent.date).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p><strong>📍 Location:</strong> {selectedEvent.location}</p>
                <p><strong>🎤 Speaker:</strong> {selectedEvent.speaker}</p>
                <p><strong>📊 Status:</strong> 
                  <span className={`event-status ${selectedEvent.status?.toLowerCase() || 'upcoming'}`}>
                    {selectedEvent.status || 'Upcoming'}
                  </span>
                </p>
              </div>

              <div className="modal-actions">
                {selectedEvent.status === 'Upcoming' && (
                  <>
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        handleRegisterEvent(selectedEvent._id);
                        setSelectedEvent(null);
                      }}
                    >
                      Register
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => {
                        handleUnregisterEvent(selectedEvent._id);
                        setSelectedEvent(null);
                      }}
                    >
                      Unregister
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal for Browse Events */}
      {showRegisterModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRegisterModal(false)}>×</button>
            
            <div className="register-icon">🎟️</div>
            <h2>Confirm Registration</h2>
            
            <p>You are about to register for:</p>
            <h3>{selectedEvent.title}</h3>
            
            <div className="register-details">
              <p>📅 {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p>📍 {selectedEvent.location}</p>
              <p>💰 {selectedEvent.price}</p>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-primary"
                onClick={() => handleRegisterEvent(selectedEvent._id)}
              >
                Confirm Registration
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowRegisterModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProfileModal(false)}>×</button>
            
            <h2>Edit Profile</h2>
            
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="ME">Mechanical</option>
                  <option value="CE">Civil</option>
                </select>
              </div>

              <div className="form-group">
                <label>Year</label>
                <select
                  value={profileForm.year}
                  onChange={(e) => setProfileForm({...profileForm, year: e.target.value})}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificates Modal */}
      {showCertificateModal && (
        <div className="modal-overlay" onClick={() => setShowCertificateModal(false)}>
          <div className="modal-content certificates-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCertificateModal(false)}>×</button>
            
            <h2>My Certificates</h2>
            
            <div className="certificates-grid">
              {dashboard?.certificatesList?.map(cert => (
                <div key={cert.id} className="certificate-card">
                  <div className="certificate-header">
                    <span className="cert-icon-large">🏆</span>
                    <h3>{cert.title}</h3>
                  </div>
                  
                  <div className="certificate-details">
                    <p><strong>Issue Date:</strong> {new Date(cert.issueDate).toLocaleDateString()}</p>
                    <p><strong>Grade:</strong> {cert.grade}</p>
                    <p><strong>Certificate ID:</strong> {cert.id}</p>
                  </div>
                  
                  <button 
                    className="btn-download-full"
                    onClick={() => handleDownloadCertificate(cert)}
                  >
                    Download Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, onClick }) {
  return (
    <div className={`stat-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <span className="stat-icon">{icon}</span>
      <span className="stat-title">{title}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

// Event Card Component
function EventCard({ event, onClick, onUnregister }) {
  return (
    <div className="event-card" onClick={onClick}>
      <img src={event.image} alt={event.title} />
      
      <div className="event-details">
        <h3>{event.title}</h3>
        <p>📅 {new Date(event.date).toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })}</p>
        <p>📍 {event.location}</p>

        <div className="event-footer">
          <span className={`event-status ${event.status.toLowerCase()}`}>
            {event.status}
          </span>
          
          {onUnregister && (
            <button 
              className="btn-unregister"
              onClick={(e) => {
                e.stopPropagation();
                onUnregister();
              }}
            >
              Unregister
            </button>
          )}
        </div>
      </div>
    </div>
  );
}