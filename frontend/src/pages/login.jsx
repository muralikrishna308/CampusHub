import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulation: determine dashboard based on email contents
    if (email.toLowerCase().includes("admin")) {
      navigate("/admin/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>
        <h2>Welcome Back</h2>
        <p>Sign in to your CampusEventHub account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit">Sign In</button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
