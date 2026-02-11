import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4ecdc4 0%, #2c7a7b 100%)',
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
        color: '#4ecdc4',
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
        backgroundColor: '#4ecdc4',
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
        color: '#4ecdc4',
        textDecoration: 'none',
        display: 'block',
        textAlign: 'center',
        marginTop: '20px',
        cursor: 'pointer'
    }
};

const AdminRegister = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'admin'
        });
        
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Admin Registration</h1>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            style={styles.input}
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter admin name"
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            style={styles.input}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter admin email"
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
                            placeholder="Create a password"
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            style={styles.input}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                
                <a
                    style={styles.link}
                    onClick={() => navigate('/role/admin')}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                    ← Back to Admin Portal
                </a>
            </div>
        </div>
    );
};

export default AdminRegister;