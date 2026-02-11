import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // After registration, redirect to login
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">👤</div>
        <h2>Create Account</h2>
        <p>Join CampusEventHub today</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>College / University</label>
            <input type="text" placeholder="Enter college name" required />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select>
              <option>Student</option>
              <option>College Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm your password" required />
          </div>

          <button type="submit">Create Account</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
