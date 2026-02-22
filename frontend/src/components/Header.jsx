import React from "react";

const Header = ({ userName, userRole, id }) => {
    return (
        <header className="header">
            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search events, colleges, or categories..." />
            </div>

            <div className="user-profile">
                <div className="user-info">
                    <span className="name">{userName}</span>
                    <span className="role">{userRole} • ID: {id}</span>
                </div>
                <div className="avatar">
                    {/* Placeholder for avatar image or initials */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: '#EEF0FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4F5FEF',
                        fontWeight: '700'
                    }}>
                        {userName?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
