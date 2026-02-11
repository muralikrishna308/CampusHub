import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ role }) {
    const location = useLocation();

    const studentMenu = [
        { title: "Events", icon: "📅", path: "/student/dashboard" },
        { title: "My Registrations", icon: "📋", path: "/student/registrations" },
        { title: "Settings", icon: "⚙️", path: "/student/settings" },
    ];

    const adminMenu = [
        { title: "Events Management", icon: "📅", path: "/admin/dashboard" },
        { title: "User Analytics", icon: "📊", path: "/admin/analytics" },
        { title: "System Settings", icon: "⚙️", path: "/admin/settings" },
    ];

    const menu = role === "admin" ? adminMenu : studentMenu;

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <span>✨</span> CampusHub
            </div>
            <ul className="sidebar-menu">
                {menu.map((item) => (
                    <li key={item.title}>
                        <Link
                            to={item.path}
                            className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
                        >
                            <span className="icon">{item.icon}</span>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <Link to="/" className="menu-item" style={{ marginTop: "40px" }}>
                    <span className="icon">🚪</span> Logout
                </Link>
            </div>
        </div>
    );
}
