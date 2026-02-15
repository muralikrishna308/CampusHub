import { Link } from "react-router-dom";
import "../styles/auth.css";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

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
      const msg = await (err.json ? err.json().then(j=>j.msg).catch(()=>null) : null) || 'Login failed';
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>
        <h2>Welcome Back</h2>
        <p>Sign in to your CampusEventHub account</p>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Enter your password" required />

          <button type="submit">Sign In</button>
        </form>
        {error && <p style={{color:'red', marginTop:10}}>{error}</p>}

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
