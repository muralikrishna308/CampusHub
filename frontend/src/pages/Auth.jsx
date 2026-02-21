import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import "../styles/auth.css";
import Chatbot from '../components/Chatbot';

export default function Auth() {
    const { login, register } = useContext(AuthContext);
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [error, setError] = useState(null);

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regCollege, setRegCollege] = useState('');
    const [regRole, setRegRole] = useState('student');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(loginEmail, loginPassword);
        } catch (err) {
            const msg = await (err.json ? err.json().then(j => j.msg).catch(() => null) : null) || 'Login failed';
            setError(msg);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        if (regPassword !== regConfirm) return setError('Passwords do not match');
        try {
            await register({ name: regName, email: regEmail, password: regPassword, role: regRole, college: regCollege });
        } catch (err) {
            const msg = await (err.json ? err.json().then(j => j.msg).catch(() => null) : null) || 'Registration failed';
            setError(msg);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className={`auth-main-container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
                {/* Sign Up Form */}
                <div className="form-container sign-up-container">
                    <form className="auth-form-v2" onSubmit={handleRegister}>
                        <h1 className="auth-title">Create Account</h1>
                        <div className="social-container">
                            <span className="social-icon">CampusEventHub</span>
                        </div>
                        <span className="auth-subtitle">or use your email for registration</span>
                        <input type="text" placeholder="Full Name" value={regName} onChange={e => setRegName(e.target.value)} required />
                        <input type="email" placeholder="Email Address" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                        <input type="text" placeholder="College" value={regCollege} onChange={e => setRegCollege(e.target.value)} />
                        <select value={regRole} onChange={e => setRegRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="admin">College Admin</option>
                        </select>
                        <input type="password" placeholder="Password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                        <input type="password" placeholder="Confirm" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} required />

                        <button className="auth-btn-v2" type="submit">Sign Up</button>
                        {error && <p className="error-text">{error}</p>}
                    </form>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in-container">
                    <form className="auth-form-v2" onSubmit={handleLogin}>
                        <h1 className="auth-title">Sign in</h1>
                        <div className="social-container">
                            <span className="social-icon">CampusEventHub</span>
                        </div>
                        <span className="auth-subtitle">or use your account</span>
                        <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                        <a href="#" className="forgot-password">Forgot your password?</a>
                        <button className="auth-btn-v2" type="submit">Sign In</button>
                        {error && <p className="error-text">{error}</p>}
                    </form>
                </div>

                {/* Overlay Container */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="overlay-title">Welcome Back!</h1>
                            <p className="overlay-desc">To keep connected with us please login with your personal info</p>
                            <button className="ghost auth-btn-v2" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1 className="overlay-title">Hello, Students!</h1>
                            <p className="overlay-desc">Enter your campus details and start your journey with us</p>
                            <button className="ghost auth-btn-v2" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
            <Chatbot />
        </div>
    );
}
