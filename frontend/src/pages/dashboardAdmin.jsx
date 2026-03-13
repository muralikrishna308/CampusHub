import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import Chatbot from '../components/chatbot';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allRegistrations, setAllRegistrations] = useState([]);

  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    registrationEndDate: '',
    ticketPrice: '',
    category: 'tech',
    image: null
  });

  const [reportFilters, setReportFilters] = useState({
    startDate: '2024-01-01',
    endDate: '2030-12-31',
    eventType: 'all',
    format: 'pdf'
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch events
      const eventsResponse = await fetch(
        "http://localhost:5000/api/dashboard/admin/events",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const events = await eventsResponse.json();

      // Fetch participants/registrations
      let participants = [];
      let totalRegistrations = 0;
      try {
        const registrationsResponse = await fetch(
          "http://localhost:5000/api/registrations/admin/all",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (registrationsResponse.ok) {
          participants = await registrationsResponse.json();
          totalRegistrations = participants.length;
          setAllRegistrations(participants);
        }
      } catch (regErr) {
        console.log('Could not fetch registrations:', regErr);
      }

      // Transform participants to user format
      // const uniqueUsers = Array.from(
      //   new Map(
      //     participants.map(p => [
      //       p.email,
      //       {
      //         id: p._id || p.email,
      //         name: p.firstName ? `${p.firstName} ${p.lastName}` : p.name,
      //         email: p.email,
      //         role: 'student',
      //         events: 1,
      //         joined: p.createdAt,
      //         status: p.status
      //       }
      //     ])
      //   ).values()
      // );
      const registrationUsers = participants.map(p => ({
  id: p._id,
  name: `${p.firstName} ${p.lastName}`,
  email: p.email,
  role: "student",
  events: p.event?.title,
  joined: p.createdAt,
  status: p.status
}));


      // Filter out cancelled registrations for stats accuracy
      const activeRegistrations = participants.filter(p => p.status !== 'cancelled');
      const totalActiveRegistrations = activeRegistrations.length;

      // Enrich events with registration data
      const enrichedEvents = events.map(event => {
        const eventRegistrations = activeRegistrations.filter(p => 
          (p.event?._id || p.event) === event._id
        );
        const registeredCount = eventRegistrations.length;
        const revenueAmount = registeredCount * (event.ticketPrice || 0);
        return {
          ...event,
          registered: registeredCount,
          revenue: revenueAmount
        };
      });

      const totalRevenueValue = enrichedEvents.reduce((sum, e) => sum + e.revenue, 0);

      setStats({
        totalEvents: enrichedEvents.length,
        activeEvents: enrichedEvents.filter(e => e.status === 'active').length,
        totalRegistrations: totalActiveRegistrations,
        avgParticipants: enrichedEvents.length > 0 ? Math.round(totalActiveRegistrations / enrichedEvents.length) : 0,
        totalRevenue: totalRevenueValue,
        growth: 0,
        events: enrichedEvents,
        users: registrationUsers,
        recentActivity: []
      });
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
      formData.append('category', eventForm.category || 'tech');

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
        category: 'tech',
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
          fetchDashboardData(); 
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
const acceptRegistration = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/registrations/accept/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      alert("Registration Accepted");
      fetchDashboardData(); // refresh table
    }
  } catch (error) {
    console.error(error);
  }
};

const rejectRegistration = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/registrations/reject/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      alert("Registration Rejected");
      fetchDashboardData();
    }
  } catch (error) {
    console.error(error);
  }
};
  const handleGenerateReport = () => {
    if (!stats?.events) {
      alert('No data available to generate report');
      return;
    }

    const filteredEvents = stats.events.filter(event => {
      const eventDate = new Date(event.eventDate);
      const startDate = new Date(reportFilters.startDate);
      const endDate = new Date(reportFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      const isInDateRange = eventDate >= startDate && eventDate <= endDate;
      const isTypeMatch = reportFilters.eventType === 'all' || event.category === reportFilters.eventType;
      
      return isInDateRange && isTypeMatch;
    });

    if (filteredEvents.length === 0) {
      alert('No events found for the selected filters');
      return;
    }

    const totalReg = filteredEvents.reduce((sum, e) => sum + (e.registered || 0), 0);
    const totalRev = filteredEvents.reduce((sum, e) => sum + (e.revenue || 0), 0);
    const filteredEventIds = filteredEvents.map(e => e._id);
    const relevantRegistrations = allRegistrations.filter(reg => 
      reg.event && filteredEventIds.includes(reg.event._id || reg.event)
    );

    if (reportFilters.format === 'csv') {
      // Professional Comprehensive CSV
      const headers = [
        'No.', 
        'First Name', 
        'Last Name', 
        'Email', 
        'Phone', 
        'College', 
        'Department', 
        'Year', 
        'City', 
        'Gender',
        'Event Title', 
        'Event Date', 
        'Registration Status',
        'Registered At'
      ];
      
      const rows = relevantRegistrations.map((reg, index) => [
        index + 1,
        reg.firstName || 'N/A',
        reg.lastName || 'N/A',
        reg.email || 'N/A',
        reg.phone || 'N/A',
        reg.college || 'N/A',
        reg.department || 'N/A',
        reg.year || 'N/A',
        reg.city || 'N/A',
        reg.gender || 'N/A',
        reg.event?.title || 'Unknown Event',
        reg.event?.eventDate ? new Date(reg.event.eventDate).toLocaleDateString() : 'N/A',
        reg.status || 'pending',
        reg.createdAt ? new Date(reg.createdAt).toLocaleString() : 'N/A'
      ]);

      let csv = `Event Registrations Report\n`;
      csv += `Generated on,${new Date().toLocaleString()}\n`;
      csv += `Date Range,${reportFilters.startDate} to ${reportFilters.endDate}\n`;
      csv += `Category,${reportFilters.eventType}\n\n`;
      
      csv += `SUMMARY\n`;
      csv += `Total Events,${filteredEvents.length}\n`;
      csv += `Total Registrations,${totalReg}\n`;
      csv += `Total Revenue,$${totalRev.toLocaleString()}\n\n`;
      
      csv += headers.join(',') + '\n';
      csv += rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `comprehensive_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      // Professional Landscape PDF for more columns
      const doc = new jsPDF('l', 'mm', 'a4');
      
      doc.setFontSize(22);
      doc.setTextColor(63, 81, 181);
      doc.text('Comprehensive Event Registrations Report', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()} | Filter: ${reportFilters.startDate} to ${reportFilters.endDate}`, 14, 30);
      
      doc.setDrawColor(200);
      doc.line(14, 34, 282, 34);
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('KEY METRICS', 14, 42);
      
      doc.setFontSize(10);
      doc.text(`Total Events: ${filteredEvents.length}`, 14, 48);
      doc.text(`Total Registrations: ${totalReg}`, 60, 48);
      doc.text(`Total Revenue: $${totalRev.toLocaleString()}`, 110, 48);

      const tableColumn = [
        "No.", "Name", "Email", "Phone", "College/Dept", "Year", "Event", "Status", "Date"
      ];
      
      const tableRows = relevantRegistrations.map((reg, index) => [
        index + 1,
        `${reg.firstName || ''} ${reg.lastName || ''}`,
        reg.email || 'N/A',
        reg.phone || 'N/A',
        `${reg.college || 'N/A'}${reg.department ? ' / ' + reg.department : ''}`,
        reg.year || 'N/A',
        reg.event?.title || 'Unknown',
        reg.status?.toUpperCase() || 'PENDING',
        reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'N/A'
      ]);

      autoTable(doc, {
        startY: 55,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181], fontSize: 9, cellPadding: 2 },
        bodyStyles: { fontSize: 8, cellPadding: 2 },
        alternateRowStyles: { fillColor: [245, 247, 255] },
        margin: { left: 14, right: 14 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 45 },
          3: { cellWidth: 25 },
          4: { cellWidth: 50 },
          5: { cellWidth: 15 },
          6: { cellWidth: 40 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 }
        }
      });

      doc.save(`comprehensive_report_${new Date().toISOString().split('T')[0]}.pdf`);
    }
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
                            {user.status === 'pending' || !user.status ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => acceptRegistration(user.id)}
                                  style={{
                                    background: "#22c55e",
                                    color: "white",
                                    border: "none",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                  }}
                                >
                                  Accept
                                </button>

                                <button
                                  onClick={() => rejectRegistration(user.id)}
                                  style={{
                                    background: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`status-badge ${user.status}`} style={{
                                padding: '4px 12px',
                                borderRadius: '50px',
                                fontSize: '12px',
                                fontWeight: '700',
                                textTransform: 'capitalize',
                                backgroundColor: user.status === 'accepted' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: user.status === 'accepted' ? '#22c55e' : '#ef4444',
                                border: user.status === 'accepted' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                              }}>
                                {user.status}
                              </span>
                            )}
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
            {activeTab === 'reports' && stats && (
              <div className="reports-tab">
                <h2>Analytics & Reports</h2>

                {/* Quick Stats - Dynamic */}
                <div className="quick-stats">
                  <div className="quick-stat-card">
                    <span className="quick-stat-icon">📊</span>
                    <div className="quick-stat-info">
                      <h4>Conversion Rate</h4>
                      <span>
                        {stats.totalEvents > 0
                          ? Math.round((stats.totalRegistrations / (stats.totalEvents * 100)) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <span className="quick-stat-icon">👥</span>
                    <div className="quick-stat-info">
                      <h4>Active Users</h4>
                      <span>{stats.users?.length || 0}</span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <span className="quick-stat-icon">💰</span>
                    <div className="quick-stat-info">
                      <h4>Avg. Revenue</h4>
                      <span>
                        ${stats.totalEvents > 0
                          ? Math.round(stats.totalRevenue / stats.totalEvents)
                          : 0}
                      </span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <span className="quick-stat-icon">📈</span>
                    <div className="quick-stat-info">
                      <h4>Growth</h4>
                      <span>+{stats.growth || 0}%</span>
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
                        onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                      />
                      <span>to</span>
                      <input
                        type="date"
                        className="date-input"
                        value={reportFilters.endDate}
                        onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>EVENT TYPE</label>
                    <select
                      value={reportFilters.eventType}
                      onChange={(e) => setReportFilters({ ...reportFilters, eventType: e.target.value })}
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
                      onChange={(e) => setReportFilters({ ...reportFilters, format: e.target.value })}
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="excel">Excel Spreadsheet</option>
                      <option value="csv">CSV File</option>
                    </select>
                  </div>
                </div>

                {/* Stats - Dynamic */}
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
                    <span className="stat-number">${stats.totalRevenue?.toLocaleString() || 0}</span>
                  </div>
                </div>

                {/* Charts - Dynamic */}
                <div className="report-charts">
                  <div className="chart-card">
                    <h3>Registration Trends</h3>
                    <div className="chart-placeholder">
                      <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ marginBottom: '10px', color: '#94a3b8' }}>📊 Total Registrations</p>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>
                          {stats.totalRegistrations}
                        </p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                          Across {stats.totalEvents} events
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="chart-card">
                    <h3>Revenue Overview</h3>
                    <div className="chart-placeholder">
                      <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ marginBottom: '10px', color: '#94a3b8' }}>💰 Total Revenue</p>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
                          ${stats.totalRevenue?.toLocaleString() || 0}
                        </p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                          Avg: ${stats.totalEvents > 0 ? Math.round(stats.totalRevenue / stats.totalEvents) : 0} per event
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Table - Dynamic with Filtering */}
                <div className="report-table-section">
                  <div className="report-table-header">
                    <h3>Event Performance</h3>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => {
                        const filteredData = stats.events
                          ?.filter(event => {
                            const eventDate = new Date(event.eventDate);
                            const startDate = new Date(reportFilters.startDate);
                            const endDate = new Date(reportFilters.endDate);
                            endDate.setHours(23, 59, 59, 999);
                            
                            const isInDateRange = eventDate >= startDate && eventDate <= endDate;
                            const isTypeMatch = reportFilters.eventType === 'all' || event.category === reportFilters.eventType;
                            
                            return isInDateRange && isTypeMatch;
                          })
                          .map(e => `${e.title},${new Date(e.eventDate).toLocaleDateString()},${e.registered}/${e.capacity},${e.revenue || 0},${Math.round((e.registered / (e.capacity || 1)) * 100)}%`)
                          .join('\n');

                        const csv = 'Event Name,Date,Registrations,Revenue,Conversion\n' + filteredData;
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
                        a.click();
                      }}>📥 Export</button>
                      <button className="table-action-btn" onClick={() => window.print()}>🖨️ Print</button>
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
                      {stats.events
                        ?.filter(event => {
                          const eventDate = new Date(event.eventDate);
                          const startDate = new Date(reportFilters.startDate);
                          const endDate = new Date(reportFilters.endDate);
                          endDate.setHours(23, 59, 59, 999);
                          
                          const isInDateRange = eventDate >= startDate && eventDate <= endDate;
                          const isTypeMatch = reportFilters.eventType === 'all' || event.category === reportFilters.eventType;
                          
                          return isInDateRange && isTypeMatch;
                        })
                        .map(event => (
                          <tr key={event._id}>
                            <td>{event.title}</td>
                            <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                            <td>{event.registered || 0}/{event.capacity || 0}</td>
                            <td>${(event.revenue || 0).toLocaleString()}</td>
                            <td>{event.capacity ? Math.round(((event.registered || 0) / event.capacity) * 100) : 0}%</td>
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
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Description *</label>
                <textarea
                  rows="4"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
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
                    onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
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
                    onChange={(e) => setEventForm({ ...eventForm, registrationEndDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ticket Price ($) *</label>
                  <input
                    type="number"
                    value={eventForm.ticketPrice}
                    onChange={(e) => setEventForm({ ...eventForm, ticketPrice: e.target.value })}
                    placeholder="Enter ticket price (0 for free)"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  required
                >
                  <option value="tech">💻 Technology</option>
                  <option value="music">🎵 Music</option>
                  <option value="workshop">🛠️ Workshop</option>
                  <option value="cultural">🎭 Cultural</option>
                  <option value="sports">⚽ Sports</option>
                  <option value="other">🌟 Other</option>
                </select>
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
                        setEventForm({ ...eventForm, image: file });
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
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Description *</label>
                <textarea
                  rows="4"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Date *</label>
                  <input
                    type="date"
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
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
                    onChange={(e) => setEventForm({ ...eventForm, registrationEndDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ticket Price ($) *</label>
                  <input
                    type="number"
                    value={eventForm.ticketPrice}
                    onChange={(e) => setEventForm({ ...eventForm, ticketPrice: e.target.value })}
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowReportModal(false)}>×</button>
            <h2>Export Event Report</h2>
            
            <div className="modal-form">
              <div className="form-group">
                <label>Date Range</label>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>From</label>
                    <input 
                      type="date" 
                      value={reportFilters.startDate} 
                      onChange={(e) => setReportFilters({...reportFilters, startDate: e.target.value})}
                      className="date-input"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.7rem', opacity: 0.7 }}>To</label>
                    <input 
                      type="date" 
                      value={reportFilters.endDate} 
                      onChange={(e) => setReportFilters({...reportFilters, endDate: e.target.value})}
                      className="date-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Event Category</label>
                <select 
                  value={reportFilters.eventType}
                  onChange={(e) => setReportFilters({...reportFilters, eventType: e.target.value})}
                  className="filter-select"
                  style={{ width: '100%', padding: '0.6rem' }}
                >
                  <option value="all">All Categories</option>
                  <option value="tech">Technology</option>
                  <option value="music">Music</option>
                  <option value="workshop">Workshops</option>
                  <option value="networking">Networking</option>
                  <option value="charity">Charity</option>
                </select>
              </div>

              <div className="form-group">
                <label>Export Format</label>
                <select 
                  value={reportFilters.format}
                  onChange={(e) => setReportFilters({...reportFilters, format: e.target.value})}
                  className="filter-select"
                  style={{ width: '100%', padding: '0.6rem' }}
                >
                  <option value="pdf">PDF Document</option>
                  <option value="csv">CSV File</option>
                </select>
              </div>

              <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowReportModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={() => {
                  handleGenerateReport();
                  setShowReportModal(false);
                }}>
                  Generate Report
                </button>
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