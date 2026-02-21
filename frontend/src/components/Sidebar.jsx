import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { name: "Dashboard", path: role === "admin" ? "/admin/dashboard" : "/student/dashboard", icon: "📊" },
        { name: "All Events", path: "/events", icon: "📅" },
        { name: "My Registrations", path: "/registrations", icon: "📝" },
        { name: "Profile", path: "/profile", icon: "👤" },
        { name: "Settings", path: "/settings", icon: "⚙️" },
    ];

    return (
        <aside className="sidebar">
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
    );
};

export default Sidebar;
