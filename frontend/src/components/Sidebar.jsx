import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ role, isOpen, onClose }) => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const studentMenuItems = [
        { name: "Dashboard", path: "/student", icon: "📊" },
        { name: "All Events", path: "/events", icon: "📅" },
        { name: "My Registrations", path: "/registrations", icon: "📝" },
        { name: "Profile", path: "/profile", icon: "👤" },
        { name: "Settings", path: "/settings", icon: "⚙️" },
    ];

    const adminMenuItems = [
        { name: "Dashboard", path: "/admin", icon: "📊" },
        { name: "Participants", path: "/admin/participants", icon: "👥" },
        { name: "Create Event", path: "/admin/create-event", icon: "➕" },
        { name: "My Events", path: "/admin/events", icon: "📅" },
        { name: "Settings", path: "/settings", icon: "⚙️" },
    ];

    const menuItems = role === "admin" ? adminMenuItems : studentMenuItems;

    // Close sidebar on route change (mobile)
    useEffect(() => {
        if (onClose) onClose();
    }, [location.pathname]);

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay open"
                    onClick={onClose}
                />
            )}

            <aside className={`sidebar${isOpen ? ' open' : ''}`}>
                <div className="sidebar-logo">
                    <span className="logo-icon">🎓</span>
                    <span>CampusHub</span>
                </div>

                <nav>
                    <ul className="sidebar-menu">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    <span className="menu-icon">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <div className="menu-item logout-btn" onClick={logout} style={{ cursor: 'pointer' }}>
                        <span className="menu-icon">🚪</span>
                        <span>Sign Out</span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
