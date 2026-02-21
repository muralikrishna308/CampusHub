import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import Chatbot from '../components/Chatbot';

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
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Technology',
    date: '',
    location: '',
    description: '',
    capacity: '',
    price: '',
    status: 'upcoming'
  });

  const [reportFilters, setReportFilters] = useState({
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    eventType: 'all',
    format: 'pdf'
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      // Simulated API call
      setTimeout(() => {
        setStats({
          totalEvents: 24,
          activeEvents: 8,
          totalRegistrations: 1250,
          avgParticipants: 52,
          totalRevenue: 45800,
          growth: 15.5,
          
          events: [
            { 
              _id: 1, 
              title: 'Tech Conference 2024', 
              participants: 245, 
              registered: 245,
              capacity: 300,
              active: true,
              image: eventImages.tech,
              date: '2024-03-15',
              location: 'Convention Center',
              category: 'Technology',
              revenue: 12500,
              status: 'upcoming',
              description: 'Annual technology conference featuring latest trends in AI and Web Development.',
              speaker: 'Dr. Sarah Johnson',
              time: '09:00 AM - 06:00 PM'
            },
            { 
              _id: 2, 
              title: 'Music Festival', 
              participants: 189, 
              registered: 189,
              capacity: 200,
              active: true,
              image: eventImages.music,
              date: '2024-03-20',
              location: 'Central Park',
              category: 'Music',
              revenue: 8900,
              status: 'upcoming',
              description: 'A day filled with amazing performances from top artists.',
              speaker: 'Various Artists',
              time: '12:00 PM - 11:00 PM'
            },
            { 
              _id: 3, 
              title: 'Workshop: React Basics', 
              participants: 78, 
              registered: 78,
              capacity: 100,
              active: false,
              image: eventImages.workshop,
              date: '2024-02-28',
              location: 'Online',
              category: 'Education',
              revenue: 3900,
              status: 'completed',
              description: 'Learn React fundamentals in this hands-on workshop.',
              speaker: 'Mike Johnson',
              time: '10:00 AM - 04:00 PM'
            },
            { 
              _id: 4, 
              title: 'Networking Mixer', 
              participants: 156, 
              registered: 156,
              capacity: 200,
              active: true,
              image: eventImages.networking,
              date: '2024-03-25',
              location: 'Business Center',
              category: 'Networking',
              revenue: 6200,
              status: 'upcoming',
              description: 'Connect with professionals from various industries.',
              speaker: 'Networking Hosts',
              time: '06:00 PM - 09:00 PM'
            },
            { 
              _id: 5, 
              title: 'Charity Run', 
              participants: 320, 
              registered: 320,
              capacity: 500,
              active: true,
              image: eventImages.charity,
              date: '2024-04-01',
              location: 'City Stadium',
              category: 'Charity',
              revenue: 15000,
              status: 'upcoming',
              description: 'Annual charity run to support local causes.',
              speaker: 'Charity Organization',
              time: '08:00 AM - 12:00 PM'
            },
          ],
          
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', events: 5, joined: '2024-01-15' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'student', events: 3, joined: '2024-01-20' },
            { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'organizer', events: 8, joined: '2023-12-10' },
            { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'student', events: 2, joined: '2024-02-01' },
            { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'admin', events: 12, joined: '2023-11-05' },
          ],
          
          recentActivity: [
            { id: 1, action: 'New registration', user: 'John Doe', event: 'Tech Conference', time: '2 minutes ago' },
            { id: 2, action: 'Event created', user: 'Admin', event: 'Music Festival', time: '1 hour ago' },
            { id: 3, action: 'Payment received', user: 'Jane Smith', event: 'Workshop', time: '3 hours ago' },
            { id: 4, action: 'Event completed', user: 'System', event: 'React Basics', time: '1 day ago' },
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, [token]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setNotifications([
      { id: 1, type: 'event', message: 'Tech Conference starts in 2 days', read: false, time: '5 min ago' },
      { id: 2, type: 'user', message: 'New user registered: Sarah Johnson', read: false, time: '1 hour ago' },
      { id: 3, type: 'payment', message: 'Payment received: $500 from Event Corp', read: false, time: '3 hours ago' },
      { id: 4, type: 'alert', message: 'Event capacity reached: Music Festival', read: true, time: '1 day ago' },
    ]);
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, [fetchDashboardData, fetchNotifications]);

  // Handle event creation
  const handleCreateEvent = (e) => {
    e.preventDefault();
    alert('Event created successfully!');
    setShowCreateModal(false);
    setEventForm({
      title: '',
      category: 'Technology',
      date: '',
      location: '',
      description: '',
      capacity: '',
      price: '',
      status: 'upcoming'
    });
  };

  // Handle event update
  const handleUpdateEvent = (e) => {
    e.preventDefault();
    alert('Event updated successfully!');
    setShowEditModal(false);
  };

  // Handle event deletion
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      alert('Event deleted successfully!');
      setSelectedEvent(null);
    }
  };

  // Handle user actions
  const handleUserAction = (action, user) => {
    if (action === 'delete' && window.confirm(`Delete user ${user.name}?`)) {
      alert(`User ${user.name} deleted`);
    } else if (action === 'role') {
      alert(`Role changed for ${user.name}`);
    }
  };

  // Handle report generation
  const handleGenerateReport = () => {
    alert(`Generating ${reportFilters.format.toUpperCase()} report from ${reportFilters.startDate} to ${reportFilters.endDate}`);
    setShowReportModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      upcoming: '#4f46e5',
      ongoing: '#ea580c',
      completed: '#16a34a',
      cancelled: '#dc2626'
    };
    return colors[status] || '#6b7280';
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
              <span className="user-role">{user?.role || 'Administrator'}</span>
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
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          📅 Events
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📈 Reports
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
                {/* Stats Cards */}
                <div className="stats-grid">
                  <StatCard 
                    title="Total Events" 
                    value={stats.totalEvents} 
                    icon="📅"
                    trend="+12% from last month"
                    trendType="positive"
                    onClick={() => setActiveTab('events')}
                  />
                  <StatCard 
                    title="Active Events" 
                    value={stats.activeEvents} 
                    icon="🔥"
                    trend="3 ending soon"
                    trendType="warning"
                    onClick={() => setActiveTab('events')}
                  />
                  <StatCard 
                    title="Total Registrations" 
                    value={stats.totalRegistrations} 
                    icon="👥"
                    trend="+245 this week"
                    trendType="positive"
                  />
                  <StatCard 
                    title="Total Revenue" 
                    value={`$${stats.totalRevenue?.toLocaleString()}`} 
                    icon="💰"
                    trend={`+${stats.growth}% growth`}
                    trendType="positive"
                  />
                </div>

                {/* Recent Events */}
                <div className="recent-events-section">
                  <div className="section-header">
                    <h2>Recent Events</h2>
                    <div className="header-actions">
                      <button className="btn-secondary" onClick={() => setShowReportModal(true)}>
                        <span>📊</span>
                        Export Report
                      </button>
                      <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                        <span>➕</span>
                        Create Event
                      </button>
                    </div>
                  </div>

                  <div className="events-grid">
                    {stats.events?.slice(0, 3).map(event => (
                      <EventCard
                        key={event._id}
                        event={event}
                        onClick={() => setSelectedEvent(event)}
                        onEdit={() => {
                          setEventForm(event);
                          setShowEditModal(true);
                        }}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="activity-section">
                  <h3>Recent Activity</h3>
                  <div className="activity-timeline">
                    {stats.recentActivity?.map(activity => (
                      <div key={activity.id} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <p><strong>{activity.action}</strong></p>
                          <p>{activity.user} • {activity.event}</p>
                          <small>{activity.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                      <option>Music</option>
                      <option>Education</option>
                      <option>Networking</option>
                    </select>
                    <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                      + New Event
                    </button>
                  </div>
                </div>

                <div className="events-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Registrations</th>
                        <th>Revenue</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.events?.map(event => (
                        <tr key={event._id}>
                          <td>
                            <div className="event-cell">
                              <img src={event.image} alt={event.title} />
                              <span>{event.title}</span>
                            </div>
                          </td>
                          <td>{new Date(event.date).toLocaleDateString()}</td>
                          <td>{event.location}</td>
                          <td>{event.registered}/{event.capacity}</td>
                          <td>${event.revenue?.toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${event.status}`}>
                              {event.status}
                            </span>
                          </td>
                          <td>
                            <button className="action-btn" onClick={() => {
                              setEventForm(event);
                              setShowEditModal(true);
                            }}>✏️</button>
                            <button className="action-btn" onClick={() => handleDeleteEvent(event._id)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="users-tab">
                <div className="tab-header">
                  <h2>User Management</h2>
                  <div className="tab-actions">
                    <input type="text" placeholder="Search users..." className="search-input" />
                    <select className="filter-select">
                      <option>All Roles</option>
                      <option>Students</option>
                      <option>Organizers</option>
                      <option>Admins</option>
                    </select>
                  </div>
                </div>

                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <input 
                            type="checkbox" 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(stats.users.map(u => u.id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                          />
                        </th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Events</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.users?.map(user => (
                        <tr key={user.id}>
                          <td>
                            <input 
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers([...selectedUsers, user.id]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                }
                              }}
                            />
                          </td>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-small">
                                {user.name.charAt(0)}
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <select 
                              value={user.role}
                              onChange={(e) => handleUserAction('role', { ...user, role: e.target.value })}
                              className="role-select"
                            >
                              <option value="student">Student</option>
                              <option value="organizer">Organizer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td>{user.events}</td>
                          <td>{new Date(user.joined).toLocaleDateString()}</td>
                          <td>
                            <button className="action-btn" onClick={() => handleUserAction('edit', user)}>✏️</button>
                            <button className="action-btn" onClick={() => handleUserAction('delete', user)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedUsers.length > 0 && (
                  <div className="bulk-actions">
                    <span>{selectedUsers.length} users selected</span>
                    <button className="btn-secondary">Bulk Edit</button>
                    <button className="btn-danger">Bulk Delete</button>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="reports-tab">
                <h2>Analytics & Reports</h2>
                
                {/* Quick Stats - White Cards */}
                <div className="quick-stats">
                  <div className="quick-stat-card">
                    <span className="quick-stat-icon">📊</span>
                    <div className="quick-stat-info">
                      <h4>Conversion Rate</h4>
                      <span>68.5%</span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <span className="quick-stat-icon">👥</span>
                    <div className="quick-stat-info">
                      <h4>Active Users</h4>
                      <span>1,245</span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <span className="quick-stat-icon">💰</span>
                    <div className="quick-stat-info">
                      <h4>Avg. Revenue</h4>
                      <span>$1,250</span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <span className="quick-stat-icon">📈</span>
                    <div className="quick-stat-info">
                      <h4>Growth</h4>
                      <span>+15.3%</span>
                    </div>
                  </div>
                </div>

                {/* Filters - Fixed Layout with 3 columns */}
                <div className="report-filters">
                  <div className="filter-group">
                    <label>DATE RANGE</label>
                    <div className="date-range-picker">
                      <input 
                        type="date" 
                        className="date-input" 
                        value={reportFilters.startDate}
                        onChange={(e) => setReportFilters({...reportFilters, startDate: e.target.value})}
                      />
                      <span>to</span>
                      <input 
                        type="date" 
                        className="date-input" 
                        value={reportFilters.endDate}
                        onChange={(e) => setReportFilters({...reportFilters, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="filter-group">
                    <label>EVENT TYPE</label>
                    <select
                      value={reportFilters.eventType}
                      onChange={(e) => setReportFilters({...reportFilters, eventType: e.target.value})}
                    >
                      <option value="all">All Events</option>
                      <option value="tech">Technology</option>
                      <option value="music">Music</option>
                      <option value="workshop">Workshops</option>
                      <option value="networking">Networking</option>
                      <option value="charity">Charity</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>FORMAT</label>
                    <select
                      value={reportFilters.format}
                      onChange={(e) => setReportFilters({...reportFilters, format: e.target.value})}
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="excel">Excel Spreadsheet</option>
                      <option value="csv">CSV File</option>
                    </select>
                  </div>
                </div>

                {/* Stats - White Cards */}
                <div className="report-stats">
                  <div className="stat-box">
                    <span className="stat-label">Total Events</span>
                    <span className="stat-number">{stats.totalEvents}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Total Registrations</span>
                    <span className="stat-number">{stats.totalRegistrations}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Avg Participants</span>
                    <span className="stat-number">{stats.avgParticipants}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Total Revenue</span>
                    <span className="stat-number">${stats.totalRevenue?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Charts - White Cards */}
                <div className="report-charts">
                  <div className="chart-card">
                    <h3>Registration Trends</h3>
                    <div className="chart-placeholder">
                      📊 Chart visualization would go here
                    </div>
                  </div>
                  <div className="chart-card">
                    <h3>Revenue by Category</h3>
                    <div className="chart-placeholder">
                      📈 Chart visualization would go here
                    </div>
                  </div>
                </div>

                {/* Report Table - White Background */}
                <div className="report-table-section">
                  <div className="report-table-header">
                    <h3>Event Performance</h3>
                    <div className="table-actions">
                      <button className="table-action-btn">📥 Export</button>
                      <button className="table-action-btn">🖨️ Print</button>
                    </div>
                  </div>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Registrations</th>
                        <th>Revenue</th>
                        <th>Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.events?.map(event => (
                        <tr key={event._id}>
                          <td>{event.title}</td>
                          <td>{new Date(event.date).toLocaleDateString()}</td>
                          <td>{event.registered}/{event.capacity}</td>
                          <td>${event.revenue?.toLocaleString()}</td>
                          <td>{Math.round((event.registered/event.capacity)*100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Generate Report Button */}
                <button className="generate-report" onClick={handleGenerateReport}>
                  <span>📊</span>
                  Generate {reportFilters.format.toUpperCase()} Report
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content create-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            <h2>Create New Event</h2>
            
            <form onSubmit={handleCreateEvent} className="modal-form">
              <div className="form-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={eventForm.category}
                    onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                  >
                    <option>Technology</option>
                    <option>Music</option>
                    <option>Education</option>
                    <option>Networking</option>
                    <option>Charity</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={eventForm.status}
                    onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity</label>
                  <input 
                    type="number" 
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    value={eventForm.price}
                    onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="4"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            <h2>Edit Event</h2>
            
            <form onSubmit={handleUpdateEvent} className="modal-form">
              <div className="form-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={eventForm.category}
                    onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                  >
                    <option>Technology</option>
                    <option>Music</option>
                    <option>Education</option>
                    <option>Networking</option>
                    <option>Charity</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={eventForm.status}
                    onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>×</button>
            
            <img src={selectedEvent.image} alt={selectedEvent.title} className="modal-image" />
            
            <div className="modal-details">
              <h2>{selectedEvent.title}</h2>
              
              <div className="event-meta">
                <span>📅 {new Date(selectedEvent.date).toLocaleDateString()}</span>
                <span>📍 {selectedEvent.location}</span>
                <span>🏷️ {selectedEvent.category}</span>
              </div>
              
              <p className="event-description">{selectedEvent.description}</p>
              
              <div className="event-stats-grid">
                <div className="stat-item">
                  <label>Registrations</label>
                  <span>{selectedEvent.registered}/{selectedEvent.capacity}</span>
                </div>
                <div className="stat-item">
                  <label>Revenue</label>
                  <span>${selectedEvent.revenue?.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <label>Status</label>
                  <span className={`status-badge ${selectedEvent.status}`}>
                    {selectedEvent.status}
                  </span>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="btn-primary" onClick={() => {
                  setEventForm(selectedEvent);
                  setShowEditModal(true);
                  setSelectedEvent(null);
                }}>
                  Edit Event
                </button>
                <button className="btn-secondary">View Registrations</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSettingsModal(false)}>×</button>
            <h2>Settings</h2>
            
            <div className="settings-tabs">
              <button className="settings-tab active">General</button>
              <button className="settings-tab">Notifications</button>
              <button className="settings-tab">Security</button>
              <button className="settings-tab">API</button>
            </div>
            
            <div className="settings-content">
              <div className="setting-item">
                <label>
                  <input type="checkbox" /> Enable email notifications
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" /> Auto-approve events
                </label>
              </div>
              <div className="setting-item">
                <label>Default event capacity</label>
                <input type="number" defaultValue="100" />
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-primary">Save Settings</button>
              <button className="btn-secondary" onClick={() => setShowSettingsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, trend, trendType = 'positive', onClick }) {
  return (
    <div 
      className={`stat-card ${onClick ? 'clickable' : ''}`} 
      onClick={onClick}
    >
      <div className="stat-card-header">
        <span className="stat-icon" data-icon={icon}>{icon}</span>
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

// Event Card Component
function EventCard({ event, onClick, onEdit }) {
  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-image-container">
        <img src={event.image} alt={event.title} className="event-image" />
        <span className={`event-status ${event.status}`}>{event.status}</span>
        <span className="event-category">{event.category}</span>
      </div>
      
      <div className="event-details">
        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-meta">
          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
          <span>📍 {event.location}</span>
        </div>

        <div className="event-stats">
          <div className="stat">
            <span className="stat-label">Registered</span>
            <span className="stat-value">{event.registered}/{event.capacity}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">${event.revenue?.toLocaleString()}</span>
          </div>
        </div>

        <div className="event-actions">
          <button className="btn-edit" onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}>✏️ Edit</button>
          <button className="btn-view" onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}>👁️ View</button>
        </div>
      </div>
    </div>
  );
}