import React, { useState, useEffect, useContext } from "react";
import Calendar from "./Calendar";
import { FiCalendar, FiBell } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';


const Header = ({ userName, userRole, id, registrations: initialRegistrations = [] }) => {
    const { token } = useContext(AuthContext);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [notifs, setNotifs] = useState([]);
    const [registrations, setRegistrations] = useState(initialRegistrations);

    // Helper: format relative time
    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    // Fetch real notifications from backend
    useEffect(() => {
        if (!token) return;
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${API_URL}/api/notifications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setNotifs(data.map(n => ({
                        id: n._id,
                        icon: n.icon || '🔔',
                        message: n.message,
                        time: formatTimeAgo(new Date(n.createdAt)),
                        unread: !n.isRead,
                    })));
                }
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };
        fetchNotifications();
    }, [token]);

    useEffect(() => {
        // Only fetch if we don't have registrations passed as props and we have a student token
        if (initialRegistrations.length === 0 && token && userRole === "Student") {
            const fetchRegistrations = async () => {
                try {
                    const response = await fetch(`${API_URL}/api/registrations/my-registrations`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const validRegistrations = data.filter(reg => reg.event && reg.event._id);
                        setRegistrations(validRegistrations);
                    }
                } catch (err) {
                    console.error('Error fetching registrations in Header:', err);
                }
            };
            fetchRegistrations();
        } else if (initialRegistrations.length > 0) {
            setRegistrations(initialRegistrations);
        }
    }, [initialRegistrations, token, userRole]);

    const unreadCount = notifs.filter(n => n.unread).length;

    const markAsRead = async (nId) => {
        setNotifs(prev => prev.map(n => n.id === nId ? { ...n, unread: false } : n));
        try {
            await fetch(`${API_URL}/api/notifications/read/${nId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllRead = async () => {
        setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
        try {
            await fetch(`${API_URL}/api/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    const initials = userName
        ? userName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <header className="header">
            {/* Left – greeting */}
            <div className="header-left-section">
                <span className="header-greeting">
                    👋 Welcome back, <strong>{userName?.split(' ')[0] || 'Student'}</strong>
                </span>
            </div>

            {/* Right – notifications + profile */}
            <div className="header-right-section">
                {/* Calendar Icon-btn */}
                <div className="header-notif-wrapper">
                    <button
                        className="header-icon-btn calendar-btn"
                        onClick={() => {
                            setShowCalendar(!showCalendar);
                            setShowNotifs(false);
                        }}
                        title="View Event Calendar"
                    >
                        <FiCalendar className="header-icon" />
                    </button>

                    {showCalendar && (
                        <div className="header-notif-dropdown calendar-dropdown" style={{ width: 'auto', padding: '0' }}>
                            <Calendar registrations={registrations} />
                        </div>
                    )}
                </div>

                {/* Notification bell */}
                <div className="header-notif-wrapper">
                    <button
                        className="header-icon-btn bell-btn"
                        onClick={() => {
                            setShowNotifs(!showNotifs);
                            setShowCalendar(false);
                        }}
                    >
                        <FiBell className="header-icon" />
                        {unreadCount > 0 && (
                            <span className="header-notif-badge">{unreadCount}</span>
                        )}
                    </button>

                    {showNotifs && (
                        <div className="header-notif-dropdown">
                            <div className="header-notif-dropdown__top">
                                <h4>Notifications</h4>
                                {unreadCount > 0 && (
                                    <button
                                        className="header-notif-dropdown__mark"
                                        onClick={markAllRead}
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="header-notif-dropdown__list">
                                {notifs.map(n => (
                                    <div
                                        key={n.id}
                                        className={`header-notif-item ${n.unread ? 'header-notif-item--unread' : ''}`}
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        <span className="header-notif-item__icon">{n.icon}</span>
                                        <div className="header-notif-item__body">
                                            <p>{n.message}</p>
                                            <span className="header-notif-item__time">{n.time}</span>
                                        </div>
                                        {n.unread && <span className="header-notif-item__dot"></span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="header-sep"></div>

                {/* Profile */}
                <div className="header-profile">
                    <div className="header-profile__info">
                        <span className="header-profile__name">{userName}</span>
                        <span className="header-profile__role">{userRole}</span>
                    </div>
                    <div className="header-profile__avatar">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
