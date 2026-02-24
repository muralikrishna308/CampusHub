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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    registrationEndDate: '',
    ticketPrice: '',
    image: null
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

      const response = await fetch(
        "http://localhost:5000/api/dashboard/admin/events",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const events = await response.json();
      setStats({
        totalEvents: events.length,
        activeEvents: events.filter(e => e.status === 'active').length,
        totalRegistrations: 0,
        avgParticipants: 0,
        totalRevenue: events.reduce(
          (sum, event) => sum + (event.ticketPrice || 0),
          0
        ),
        growth: 0,
        events: events,
        users: [],
        recentActivity: []
      });
      setLoading(false);

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
  const handleCreateEvent = async (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  try {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', eventForm.title);
    formData.append('description', eventForm.description);
    formData.append(
      'eventDate',
      new Date(eventForm.eventDate + 'T00:00:00').toISOString()
    );
    formData.append('location', eventForm.location);
    formData.append(
      'registrationEndDate',
      new Date(eventForm.registrationEndDate + 'T23:59:59').toISOString()
    );
    formData.append('ticketPrice', eventForm.ticketPrice || 0);

    if (eventForm.image) {
      formData.append('image', eventForm.image);
    }

    const response = await fetch(
      'http://localhost:5000/api/dashboard/create-event',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    alert('Event created successfully!');

    setShowCreateModal(false);

    setEventForm({
      title: '',
      description: '',
      eventDate: '',
      location: '',
      registrationEndDate: '',
      ticketPrice: '',
      image: null
    });

    fetchDashboardData();

  } catch (err) {
    console.error('Error creating event:', err);
    alert(`Failed to create event: ${err.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  // Handle event update
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', eventForm.title);
      formData.append('description', eventForm.description);
      formData.append('eventDate', new Date(eventForm.eventDate + 'T00:00:00').toISOString());
      formData.append('location', eventForm.location);
      formData.append('registrationEndDate', new Date(eventForm.registrationEndDate + 'T23:59:59').toISOString());
      formData.append('ticketPrice', eventForm.ticketPrice || 0);

      const response = await fetch(`http://localhost:5000/api/events/${eventForm._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: eventForm.title,
          description: eventForm.description,
          eventDate: new Date(eventForm.eventDate + 'T00:00:00').toISOString(),
          location: eventForm.location,
          registrationEndDate: new Date(eventForm.registrationEndDate + 'T23:59:59').toISOString(),
          ticketPrice: Number(eventForm.ticketPrice) || 0
        })
      });

      if (response.ok) {
        alert('Event updated successfully!');
        setShowEditModal(false);
        fetchDashboardData();
      } else {
        const error = await response.text();
        alert(`Failed to update event: ${error}`);
      }
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to update event. Please try again.');
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId) => {
  if (window.confirm('Are you sure you want to delete this event?')) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/dashboard/admin/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        alert('Event deleted successfully!');
        fetchDashboardData(); // refresh UI
      } else {
        alert('Failed to delete event');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting event');
    }
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
                          // Format dates for edit form
                          const formattedEvent = {
                            ...event,
                            eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
                            registrationEndDate: event.registrationEndDate ? event.registrationEndDate.split('T')[0] : ''
                          };
                          setEventForm(formattedEvent);
                          setShowEditModal(true);
                        }}
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
                              <img
                                src={`http://localhost:5000/uploads/${event.image}`}
                                alt={event.title}
                              />
                              <span>{event.title}</span>
                            </div>
                          </td>
                          <td>{new Date(event.eventDate).toLocaleDateString()}</td>
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
                              const formattedEvent = {
                                ...event,
                                eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
                                registrationEndDate: event.registrationEndDate ? event.registrationEndDate.split('T')[0] : ''
                              };
                              setEventForm(formattedEvent);
                              setShowEditModal(true);
                            }}>✏️</button>
                            <button
                            className="action-btn"
                            onClick={() => handleDeleteEvent(event._id)}
                            >
                              🗑️
                            </button>
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
                
                {/* Quick Stats */}
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

                {/* Filters */}
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

                {/* Stats */}
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

                {/* Charts */}
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

                {/* Report Table */}
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
                          <td>{new Date(event.eventDate).toLocaleDateString()}</td>
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
                <label>Event Title *</label>
                <input 
                  type="text" 
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Description *</label>
                <textarea 
                  rows="4"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  placeholder="Describe your event"
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Date *</label>
                  <input 
                    type="date" 
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({...eventForm, eventDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Location *</label>
                  <input 
                    type="text" 
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    placeholder="Event venue/location"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Registration End Date *</label>
                  <input 
                    type="date" 
                    value={eventForm.registrationEndDate}
                    onChange={(e) => setEventForm({...eventForm, registrationEndDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Ticket Price ($) *</label>
                  <input 
                    type="number" 
                    value={eventForm.ticketPrice}
                    onChange={(e) => setEventForm({...eventForm, ticketPrice: e.target.value})}
                    placeholder="Enter ticket price (0 for free)"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Event Image</label>
                <div className="image-upload-container">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEventForm({...eventForm, image: file});
                      }
                    }}
                  />
                  <p className="image-upload-hint">Supported formats: JPG, PNG, GIF (Max size: 5MB)</p>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
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
                <label>Event Title *</label>
                <input 
                  type="text" 
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Description *</label>
                <textarea 
                  rows="4"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Date *</label>
                  <input 
                    type="date" 
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({...eventForm, eventDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Location *</label>
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
                  <label>Registration End Date *</label>
                  <input 
                    type="date" 
                    value={eventForm.registrationEndDate}
                    onChange={(e) => setEventForm({...eventForm, registrationEndDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Ticket Price ($) *</label>
                  <input 
                    type="number" 
                    value={eventForm.ticketPrice}
                    onChange={(e) => setEventForm({...eventForm, ticketPrice: e.target.value})}
                    min="0"
                    step="0.01"
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
            
            <img
             src={`http://localhost:5000/uploads/${selectedEvent.image}`}
            alt={selectedEvent.title}
            className="modal-image"
            />
            
            <div className="modal-details">
              <h2>{selectedEvent.title}</h2>
              
              <div className="event-meta">
                <span>📅 {new Date(selectedEvent.eventDate).toLocaleDateString()}</span>
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
                  <label>Ticket Price</label>
                  <span>${selectedEvent.ticketPrice}</span>
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
                  const formattedEvent = {
                    ...selectedEvent,
                    eventDate: selectedEvent.eventDate ? selectedEvent.eventDate.split('T')[0] : '',
                    registrationEndDate: selectedEvent.registrationEndDate ? selectedEvent.registrationEndDate.split('T')[0] : ''
                  };
                  setEventForm(formattedEvent);
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
      <Chatbot />
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
        <img
        src={`http://localhost:5000/uploads/${event.image}`}
        alt={event.title}
        className="event-image"
        />
        <span className={`event-status ${event.status}`}>{event.status}</span>
        <span className="event-category">{event.category}</span>
      </div>
      
      <div className="event-details">
        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-meta">
          <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
          <span>📍 {event.location}</span>
        </div>

        <div className="event-stats">
          <div className="stat">
            <span className="stat-label">Registered</span>
            <span className="stat-value">{event.registered}/{event.capacity}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Price</span>
            <span className="stat-value">${event.ticketPrice}</span>
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