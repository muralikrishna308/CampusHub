import { Link } from "react-router-dom";
import "../styles/auth.css";
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

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
      const msg = await (err.json ? err.json().then(j=>j.msg).catch(()=>null) : null) || 'Registration failed';
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">👤</div>
        <h2>Create Account</h2>
        <p>Join CampusEventHub today</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="Enter your full name" required />

          <label>Email Address</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Enter your email" required />

          <label>College / University</label>
          <input value={college} onChange={e=>setCollege(e.target.value)} type="text" placeholder="Enter college name" />

          <label>Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="admin">College Admin</option>
          </select>

          <label>Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Create a password" required />

          <label>Confirm Password</label>
          <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" placeholder="Confirm your password" required />

          <button type="submit">Create Account</button>
        </form>
        {error && <p style={{color:'red', marginTop:10}}>{error}</p>}

        <p className="auth-switch">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
