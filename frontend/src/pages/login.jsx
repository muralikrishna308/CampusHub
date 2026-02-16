import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      const msg = await (err.json ? err.json().then(j => j.msg).catch(() => null) : null) || 'Login failed';
      setError(msg);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <span className="auth-logo">CampusEventHub</span>
          <h2>Welcome back</h2>
          <p>Sign in to manage your campus events.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              placeholder="name@college.edu" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              placeholder="Enter your password" 
              required 
            />
          </div>

          <button type="submit" className="auth-button">Sign In</button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <footer className="auth-switch">
          Don't have an account? <Link to="/register">Create one for free</Link>
        </footer>
      </div>
    </main>
  );
}