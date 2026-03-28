import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/dashboard.css";

const SettingsPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    platform: true,
    browser: false
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showEmail: false
  });

  const toggleSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const userRole = user?.role?.toLowerCase() || 'student';
  const sidebarRole = userRole === 'super_admin' ? 'superadmin' : userRole;
  const profilePath = userRole === 'admin' ? '/admin/profile' : userRole === 'super_admin' ? '/super-admin/profile' : '/profile';

  return (
    <div className="dashboard-container">
      <Sidebar role={sidebarRole} isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <main className="main-content">
        <Header 
          userName={user?.name || "User"} 
          userRole={userRole.replace('_', ' ')} 
          id={user?.id}
          onToggle={toggleSidebar} 
        />

        <div className="settings-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#fff', marginBottom: '32px', fontFamily: "'Inter', sans-serif" }}>Account Settings</h1>

          {/* Notifications Section */}
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>🔔 Notifications</h3>
            <div style={settingItemStyle}>
              <div>
                <span style={labelStyle}>Email Notifications</span>
                <p style={subLabelStyle}>Receive event updates and reminders via email</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.email} 
                onChange={() => handleNotificationChange('email')}
                style={checkboxStyle}
              />
            </div>
            <div style={settingItemStyle}>
              <div>
                <span style={labelStyle}>Platform Alerts</span>
                <p style={subLabelStyle}>In-app notifications for feedback and messages</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.platform} 
                onChange={() => handleNotificationChange('platform')}
                style={checkboxStyle}
              />
            </div>
          </section>

          {/* Security & Account */}
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>🔒 Security & Account</h3>
            <div style={settingItemStyle}>
              <div>
                <span style={labelStyle}>Password</span>
                <p style={subLabelStyle}>Update your account password</p>
              </div>
              <button 
                onClick={() => navigate('/forgot-password')}
                style={actionButtonStyle}
              >
                Change Password
              </button>
            </div>
            <div style={settingItemStyle}>
              <div>
                <span style={labelStyle}>Profile Visibility</span>
                <p style={subLabelStyle}>Make your profile visible to other users</p>
              </div>
              <input 
                type="checkbox" 
                checked={privacy.publicProfile} 
                onChange={() => handlePrivacyChange('publicProfile')}
                style={checkboxStyle}
              />
            </div>
          </section>

          {/* Quick Links */}
          <section style={{ ...sectionStyle, borderBottom: 'none' }}>
            <h3 style={sectionTitleStyle}>🔗 Quick Links</h3>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button onClick={() => navigate(profilePath)} style={secondaryButtonStyle}>View Profile</button>
              <button onClick={logout} style={{ ...secondaryButtonStyle, color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}>Sign Out</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Styles
const sectionStyle = {
  padding: '24px 0',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const sectionTitleStyle = {
  fontSize: '14px',
  color: '#667eea',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  margin: 0,
  fontWeight: '800'
};

const settingItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const labelStyle = {
  fontSize: '16px',
  color: '#fff',
  fontWeight: '600',
  display: 'block'
};

const subLabelStyle = {
  fontSize: '13px',
  color: '#94a3b8',
  margin: '4px 0 0 0'
};

const checkboxStyle = {
  width: '20px',
  height: '20px',
  accentColor: '#667eea',
  cursor: 'pointer'
};

const actionButtonStyle = {
  padding: '8px 16px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'inherit'
};

const secondaryButtonStyle = {
  padding: '10px 20px',
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.2s'
};

export default SettingsPage;
