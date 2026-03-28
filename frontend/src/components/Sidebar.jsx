import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ role, isOpen, onClose, activeTab, onTabChange }) => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    // Dashboard base path for the current role
    const dashboardPath = role === "super_admin" || role === "superadmin" 
        ? "/super-admin" 
        : role === "admin" 
            ? "/admin" 
            : "/student";

    const studentMenuItems = [
        { name: "Dashboard", path: "/student", icon: "📊" },
        { name: "All Events", path: "/events", icon: "📅" },
        { name: "My Registrations", path: "/registrations", icon: "📝" },
        { name: "Certifications", path: "/certificates", icon: "🏅" },
        { name: "Profile", path: "/profile", icon: "👤" },
        { name: "Settings", path: "/settings", icon: "⚙️" },
    ];

    const adminMenuItems = [
        { name: "Overview", tab: "overview", icon: "📊" },
        { name: "My Events", tab: "events", icon: "📅" },
        { name: "Participants", tab: "users", icon: "👥" },
        { name: "Feedbacks", tab: "feedbacks", icon: "💬" },
        { name: "Reports", tab: "reports", icon: "📈" },
        { name: "Profile", path: "/admin/profile", icon: "👤" },
        { name: "Settings", path: "/settings", icon: "⚙️" },
    ];

    const superAdminMenuItems = [
        { name: "Overview", tab: "overview", icon: "🏛️" },
        { name: "Events", tab: "events", icon: "📅" },
        { name: "Users", tab: "users", icon: "👥" },
        { name: "Feedbacks", tab: "feedbacks", icon: "💬" },
        { name: "Reports", tab: "reports", icon: "📈" },
        { name: "Profile", path: "/super-admin/profile", icon: "👤" },
        { name: "Settings", path: "/settings", icon: "⚙️" },
    ];

    const menuItems = role === "super_admin" || role === "superadmin" 
        ? superAdminMenuItems 
        : role === "admin" 
            ? adminMenuItems 
            : studentMenuItems;

    // Close sidebar on route change (mobile)
    useEffect(() => {
        // We only want to close the sidebar if it was open AND the user navigated
        if (onClose) {
            onClose();
        }
        // ESLint might complain, but we ONLY want this to run when the pathname changes
        // Adding onClose to dependencies causes an infinite loop if the parent doesn't use useCallback
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    {/* Burger icon inside sidebar for mobile close */}
                    <button className="sidebar-toggle sidebar-internal-toggle" onClick={onClose} aria-label="Close Menu">
                        ✕
                    </button>
                    <div className="logo-icon">🎓</div>
                    <span>CampusHub</span>
                </div>

                <nav>
                    <ul className="sidebar-menu">
                        {menuItems.map((item, index) => {
                            const isActive = item.path 
                                ? location.pathname === item.path
                                : onTabChange 
                                    ? activeTab === item.tab 
                                    : (location.pathname === dashboardPath && (location.state?.activeTab === item.tab || (!location.state?.activeTab && item.tab === 'overview')));
                            
                            return (
                                <li key={index}>
                                    {item.path ? (
                                        <Link
                                            to={item.path}
                                            className={`menu-item ${isActive ? 'active' : ''}`}
                                        >
                                            <span className="menu-icon">{item.icon}</span>
                                            <span>{item.name}</span>
                                        </Link>
                                    ) : onTabChange ? (
                                        <div
                                            className={`menu-item ${isActive ? 'active' : ''}`}
                                            onClick={() => {
                                                onTabChange(item.tab);
                                                if (onClose) onClose();
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span className="menu-icon">{item.icon}</span>
                                            <span>{item.name}</span>
                                        </div>
                                    ) : (
                                        <Link
                                            to={item.path || (item.tab ? dashboardPath : '#')}
                                            state={item.tab ? { activeTab: item.tab } : null}
                                            className={`menu-item ${isActive ? 'active' : ''}`}
                                        >
                                            <span className="menu-icon">{item.icon}</span>
                                            <span>{item.name}</span>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
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
