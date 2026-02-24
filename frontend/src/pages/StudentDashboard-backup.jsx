import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Chatbot from "../components/Chatbotdata";

export default function StudentDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    year: user?.year || ''
  });

  // Fetch dashboard data from real APIs
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Fetch registrations
      const registrationsRes = await fetch('http://localhost:5000/api/registrations/my-registrations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const registrations = registrationsRes.ok ? await registrationsRes.json() : [];

      // Fetch profile
      const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = profileRes.ok ? await profileRes.json() : null;

      // Check profile completion
      const profileCheckRes = await fetch('http://localhost:5000/api/auth/profile/check', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileCheck = await profileCheckRes.json();
      setProfileComplete(profileCheck.profileComplete);

      // Fetch all events
      const eventsRes = await fetch('http://localhost:5000/api/events/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const allEvents = eventsRes.ok ? await eventsRes.json() : [];

      const nowDate = new Date();
      const upcoming = registrations.filter(reg => new Date(reg.event?.eventDate) > nowDate);
      const completed = registrations.filter(reg => new Date(reg.event?.eventDate) < nowDate);

      setDashboard({
        enrolledEvents: registrations.length,
        upcomingEvents: upcoming.length,
        certificates: completed.length,
        profileCompletion: profileCheck.profileComplete ? 100 : 60,
        totalHours: completed.length * 2,
        upcomingEventsList: registrations,
        certificatesList: completed.map((reg, idx) => ({
          id: `CERT-${idx}`,
          title: reg.event?.title,
          issueDate: reg.event?.eventDate,
          grade: 'A',
          downloadUrl: '#'
        }))
      });

      if (profileData) {
        setProfileForm({
          name: profileData.name || user?.name || '',
          phone: profileData.phone || '',
          department: profileData.department || '',
          year: profileData.year || ''
        });
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setLoading(false);
    }
  }, [token, user?.name]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRegisterEvent = async (eventId) => {
    try {
      const res = await fetch('http://localhost:5000/api/registrations/register-event', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId })
      });

      if (res.ok) {
        alert('Successfully registered for event!');
        fetchDashboardData();
        setSelectedEvent(null);
      } else {
        alert('Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed');
    }
  };

  const handleUnregisterEvent = async (registrationId) => {
    if (!window.confirm('Are you sure you want to unregister?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/registrations/cancel/${registrationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert('Successfully unregistered');
        fetchDashboardData();
      } else {
        alert('Failed to unregister');
      }
    } catch (err) {
      console.error('Unregister error:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });

      if (res.ok) {
        alert('Profile updated successfully!');
        setShowProfileModal(false);
        fetchDashboardData();
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />
      <main className="main-content">
        <Header userName={user?.name || 'Student'} userRole="Student" id={user?.id} />

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading dashboard...</p>
          </div>
        ) : dashboard && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard title="Enrolled Events" value={dashboard.enrolledEvents} icon="📚" />
              <StatCard title="Upcoming Events" value={dashboard.upcomingEvents} icon="⏳" />
              <StatCard title="Completed Events" value={dashboard.certificates} icon="🏆" />
              <StatCard title="Total Hours" value={dashboard.totalHours || 0} icon="📊" />
            </div>

            {/* Your Events */}
            <section style={{ marginTop: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Your Registered Events</h2>
                <button className="btn-secondary" onClick={() => navigate('/events')}>
                  🔍 Browse More Events
                </button>
              </div>

              {dashboard.upcomingEventsList?.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '10px', padding: '40px', textAlign: 'center' }}>
                  <p style={{ color: '#6f767e' }}>No registered events yet. <a href="#" onClick={() => navigate('/events')}>Browse events</a> to register!</p>
                </div>
              ) : (
                <div className="events-grid">
                  {dashboard.upcomingEventsList?.map(reg => (
                    <EventCard
                      key={reg._id}
                      event={reg.event}
                      registration={reg}
                      onClick={() => setSelectedEvent({...reg.event, registrationId: reg._id})}
                      onUnregister={() => handleUnregisterEvent(reg._id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Certificates */}
            {dashboard.certificatesList?.length > 0 && (
              <section style={{ marginTop: '40px' }}>
                <h2 style={{ marginBottom: '20px' }}>🏆 Your Certificates ({dashboard.certificatesList.length})</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                  {dashboard.certificatesList?.map(cert => (
                    <div key={cert.id} style={{ background: 'white', border: '1px solid #efefef', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏆</div>
                      <h4 style={{ margin: '0 0 8px 0' }}>{cert.title}</h4>
                      <p style={{ color: '#6f767e', fontSize: '12px', margin: '0 0 12px 0' }}>Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                      <button className="btn-download">Download</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Update Profile Button */}
            <section style={{ marginTop: '40px', marginBottom: '40px' }}>
              <button onClick={() => setShowProfileModal(true)} className="btn-primary">
                ✏️ Update Profile
              </button>
            </section>
          </>
        )}
      </main>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>×</button>

            {selectedEvent.image && (
              <img src={`http://localhost:5000/uploads/${selectedEvent.image}`} alt={selectedEvent.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />
            )}

            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.description}</p>

            <div style={{ margin: '20px 0', background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
              <p><strong>📅 Date:</strong> {new Date(selectedEvent.eventDate).toLocaleDateString()}</p>
              <p><strong>📍 Location:</strong> {selectedEvent.location}</p>
              <p><strong>💰 Price:</strong> ${selectedEvent.ticketPrice || 0}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-danger" onClick={() => handleUnregisterEvent(selectedEvent.registrationId)}>
                Unregister
              </button>
              <button className="btn-secondary" onClick={() => setSelectedEvent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <button className="modal-close" onClick={() => setShowProfileModal(false)}>×</button>
            <h2>Edit Profile</h2>

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label>Full Name</label>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
              </div>

              <div>
                <label>Phone</label>
                <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
              </div>

              <div>
                <label>Department</label>
                <select value={profileForm.department} onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}>
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="ME">Mechanical</option>
                  <option value="CE">Civil</option>
                </select>
              </div>

              <div>
                <label>Year</label>
                <select value={profileForm.year} onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}>
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '10px', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '12px', color: '#6f767e', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f46e5' }}>{value}</div>
    </div>
  );
}

function EventCard({ event, registration, onClick, onUnregister }) {
  return (
    <div style={{ background: 'white', border: '1px solid #efefef', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
      {event?.image && (
        <img src={`http://localhost:5000/uploads/${event.image}`} alt={event.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
      )}
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700' }}>{event?.title}</h3>
        <p style={{ fontSize: '13px', color: '#6f767e', margin: '0 0 8px 0' }}>📅 {new Date(event?.eventDate).toLocaleDateString()}</p>
        <p style={{ fontSize: '13px', color: '#6f767e', margin: '0 0 12px 0' }}>📍 {event?.location}</p>
        <p style={{ fontSize: '12px', color: '#16a34a', margin: '0 0 12px 0' }}>✅ {registration?.status}</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onClick} className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>View Details</button>
          <button onClick={(e) => { e.stopPropagation(); onUnregister(); }} className="btn-danger" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>Unregister</button>
        </div>
      </div>
    </div>
  );
}
