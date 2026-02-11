import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">👤</div>
        <h2>Create Account</h2>
        <p>Join CampusEventHub today</p>

        <form>
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" />

          <label>College / University</label>
          <input type="text" placeholder="Enter college name" />

          <label>Role</label>
          <select>
            <option>Student</option>
            <option>College Admin</option>
          </select>

          <label>Password</label>
          <input type="password" placeholder="Create a password" />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" />

          <button type="submit">Create Account</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
