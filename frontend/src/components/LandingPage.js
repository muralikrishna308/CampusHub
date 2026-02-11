import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    content: {
        maxWidth: '800px',
        textAlign: 'center',
        color: 'white'
    },
    title: {
        fontSize: '3.5rem',
        marginBottom: '20px',
        fontWeight: '700'
    },
    subtitle: {
        fontSize: '1.2rem',
        marginBottom: '40px',
        opacity: 0.95,
        lineHeight: '1.6'
    },
    buttonContainer: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    button: {
        padding: '15px 40px',
        fontSize: '1.1rem',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    studentBtn: {
        backgroundColor: '#ff6b6b',
        color: 'white'
    },
    adminBtn: {
        backgroundColor: '#4ecdc4',
        color: 'white'
    }
};

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    React.useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        }
    }, [user, navigate]);

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>College Management System</h1>
                <p style={styles.subtitle}>
                    Streamline your academic journey with our comprehensive college management platform. 
                    Access courses, track progress, and manage your educational experience.
                </p>
                <div style={styles.buttonContainer}>
                    <button
                        onClick={() => navigate('/role/student')}
                        style={{...styles.button, ...styles.studentBtn}}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 10px 20px rgba(255,107,107,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Student Portal
                    </button>
                    <button
                        onClick={() => navigate('/role/admin')}
                        style={{...styles.button, ...styles.adminBtn}}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 10px 20px rgba(78,205,196,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Admin Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;