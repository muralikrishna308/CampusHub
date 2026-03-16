import React, { useState, useEffect, useContext } from "react";
import Calendar from "./Calendar";
import { FiCalendar, FiBell } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

const NOTIFICATIONS = [
    { id: 1, icon: '📅', message: 'Tech Conference starts in 2 days', time: '5 min ago', unread: true },
    { id: 2, icon: '✅', message: 'Registration confirmed for Music Fest', time: '1 hour ago', unread: true },
    { id: 3, icon: '🎉', message: 'New event added: AI Workshop 2026', time: '3 hours ago', unread: true },
    { id: 4, icon: '🔔', message: 'Reminder: Sports Day tomorrow', time: '1 day ago', unread: false },
];

const Header = ({ userName, userRole, id, registrations: initialRegistrations = [] }) => {
    const { token } = useContext(AuthContext);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [notifs, setNotifs] = useState(NOTIFICATIONS);
    const [registrations, setRegistrations] = useState(initialRegistrations);

    useEffect(() => {
        // Only fetch if we don't have registrations passed as props and we have a student token
        if (initialRegistrations.length === 0 && token && userRole === "Student") {
            const fetchRegistrations = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/registrations/my-registrations', {
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

    const markAsRead = (nId) => {
        setNotifs(prev => prev.map(n => n.id === nId ? { ...n, unread: false } : n));
    };

    const markAllRead = () => {
        setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
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
