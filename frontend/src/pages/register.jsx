import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import "../styles/auth.css";
import Chatbot from '../components/chatbot';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) return setError('Passwords do not match');
    try {
      await register({ name, email, password, role, college });
    } catch (err) {
      const msg = await (err.json ? err.json().then(j => j.msg).catch(() => null) : null) || 'Registration failed';
      setError(msg);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <main className="auth-container">
        <div className="auth-card">
          <header className="auth-header">
            <span className="auth-logo">CampusEventHub</span>
            <h2>Create Account</h2>
            <p>Join your campus community today.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="John Doe" required />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="name@college.edu" required />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>College</label>
                <input value={college} onChange={e => setCollege(e.target.value)} type="text" placeholder="University Name" />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="admin">College Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Create a password" required />
              </div>
              <div className="input-group">
                <label>Confirm</label>
                <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" placeholder="Confirm password" required />
              </div>
            </div>

            <button type="submit" className="auth-button">Create Account</button>
          </form>

          {error && <div className="error-message">{error}</div>}

          <footer className="auth-switch">
            Already have an account? <Link to="/">Sign in</Link>
          </footer>
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
