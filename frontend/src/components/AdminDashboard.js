import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
    },
    navbar: {
        backgroundColor: 'white',
        padding: '20px 40px',
        borderRadius: '10px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
        color: '#4ecdc4',
        margin: 0
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    logoutBtn: {
        padding: '8px 16px',
        backgroundColor: '#4ecdc4',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    content: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    welcome: {
        fontSize: '1.5rem',
        color: '#333',
        marginBottom: '20px'
    },
    card: {
        backgroundColor: '#f7fafc',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    },
    statItem: {
        backgroundColor: '#4ecdc4',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
    }
};

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <h2 style={styles.title}>Admin Dashboard</h2>
                <div style={styles.userInfo}>
                    <span>Welcome, {user?.name}</span>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            
            <div style={styles.content}>
                <h3 style={styles.welcome}>
                    Hello {user?.name}! 👋
                </h3>
                
                <div style={styles.card}>
                    <h4>Admin Information</h4>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> Administrator</p>
                    <p><strong>Admin ID:</strong> {user?.id}</p>
                </div>
                
                <div style={styles.stats}>
                    <div style={styles.statItem}>
                        <h3>150+</h3>
                        <p>Total Students</p>
                    </div>
                    <div style={styles.statItem}>
                        <h3>12</h3>
                        <p>Faculty Members</p>
                    </div>
                    <div style={styles.statItem}>
                        <h3>8</h3>
                        <p>Departments</p>
                    </div>
                    <div style={styles.statItem}>
                        <h3>24</h3>
                        <p>Courses</p>
                    </div>
                </div>
                
                <div style={styles.card}>
                    <h4>Admin Actions</h4>
                    <ul>
                        <li>Manage Students</li>
                        <li>Manage Faculty</li>
                        <li>Course Management</li>
                        <li>Reports & Analytics</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;