import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
    },
    title: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '10px',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '30px',
        textAlign: 'center'
    },
    button: {
        width: '100%',
        padding: '15px',
        fontSize: '1.1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '600',
        marginBottom: '15px',
        transition: 'transform 0.2s, opacity 0.2s'
    },
    loginBtn: {
        backgroundColor: '#667eea',
        color: 'white'
    },
    registerBtn: {
        backgroundColor: '#48bb78',
        color: 'white'
    },
    backBtn: {
        backgroundColor: '#e2e8f0',
        color: '#4a5568'
    }
};

const RoleSelection = () => {
    const navigate = useNavigate();
    const { role } = useParams();

    const roleInfo = {
        student: {
            title: 'Student Portal',
            subtitle: 'Access your courses, assignments, and academic progress',
            loginPath: '/login/student',
            registerPath: '/register/student',
            color: '#ff6b6b'
        },
        admin: {
            title: 'Admin Portal',
            subtitle: 'Manage students, faculty, and college operations',
            loginPath: '/login/admin',
            registerPath: '/register/admin',
            color: '#4ecdc4'
        }
    };

    const currentRole = roleInfo[role] || roleInfo.student;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>{currentRole.title}</h1>
                <p style={styles.subtitle}>{currentRole.subtitle}</p>
                
                <button
                    onClick={() => navigate(currentRole.loginPath)}
                    style={{...styles.button, ...styles.loginBtn}}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                    Login
                </button>
                
                <button
                    onClick={() => navigate(currentRole.registerPath)}
                    style={{...styles.button, ...styles.registerBtn}}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                    Register
                </button>
                
                <button
                    onClick={() => navigate('/')}
                    style={{...styles.button, ...styles.backBtn}}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default RoleSelection;