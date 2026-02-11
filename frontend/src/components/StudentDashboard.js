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
        color: '#ff6b6b',
        margin: 0
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    logoutBtn: {
        padding: '8px 16px',
        backgroundColor: '#ff6b6b',
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
    }
};

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <h2 style={styles.title}>Student Dashboard</h2>
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
                    <h4>Student Information</h4>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> Student</p>
                    <p><strong>Student ID:</strong> {user?.id}</p>
                </div>
                
                <div style={styles.card}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li>View Courses</li>
                        <li>Check Assignments</li>
                        <li>Academic Progress</li>
                        <li>Fee Details</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;