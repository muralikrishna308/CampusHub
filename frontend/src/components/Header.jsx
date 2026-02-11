export default function Header({ userName, userRole, id }) {
    return (
        <header className="header">
            <div className="search-bar">
                <span>🔍</span>
                <input type="text" placeholder="Search events, colleges, or keywords..." />
            </div>
            <div className="user-profile">
                <div className="notification-bell">🔔</div>
                <div className="user-info">
                    <span className="name">{userName}</span>
                    <span className="role">{userRole} {id && `#${id}`}</span>
                </div>
                <div className="avatar"></div>
            </div>
        </header>
    );
}
