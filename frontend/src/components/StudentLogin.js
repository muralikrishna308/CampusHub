import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
        color: '#ff6b6b',
        marginBottom: '30px',
        textAlign: 'center'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#4a5568',
        fontWeight: '600'
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '2px solid #e2e8f0',
        borderRadius: '5px',
        fontSize: '1rem',
        transition: 'border-color 0.2s'
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'transform 0.2s, opacity 0.2s'
    },
    error: {
        backgroundColor: '#fed7d7',
        color: '#c53030',
        padding: '12px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    link: {
        color: '#ff6b6b',
        textDecoration: 'none',
        display: 'block',
        textAlign: 'center',
        marginTop: '20px',
        cursor: 'pointer'
    }
};

const StudentLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password, 'student');
        
        if (result.success) {
            navigate('/student/dashboard');
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Student Login</h1>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            style={styles.input}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            style={styles.input}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <a
                    style={styles.link}
                    onClick={() => navigate('/role/student')}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                    ← Back to Student Portal
                </a>
            </div>
        </div>
    );
};

export default StudentLogin;