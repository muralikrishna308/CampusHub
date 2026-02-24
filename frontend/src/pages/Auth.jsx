// pages/Auth.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';
  
  // Animation states
  const [slideDirection, setSlideDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMode, setCurrentMode] = useState(isLogin ? 'login' : 'register');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState('student');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle mode switching with slower slide animation
  const switchMode = (newMode) => {
    if (newMode === currentMode || isAnimating) return;
    
    // Set slide direction based on mode change
    if (newMode === 'login') {
      setSlideDirection('left'); // Slide from left when going to login
    } else {
      setSlideDirection('right'); // Slide from right when going to register
    }
    
    setIsAnimating(true);
    
    // Slower slide out animation (500ms instead of 300ms)
    setTimeout(() => {
      setCurrentMode(newMode);
      navigate(newMode === 'login' ? '/login' : '/register');
      
      // Reset forms
      setEmail('');
      setPassword('');
      setRememberMe(false);
      setName('');
      setCollege('');
      setRole('student');
      setConfirmPassword('');
      
      // Trigger slide in
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 500); // Increased from 300ms to 500ms
  };

  // Update currentMode when path changes
  useEffect(() => {
    setCurrentMode(isLogin ? 'login' : 'register');
  }, [isLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMode === 'login') {
      console.log('Login:', { email, password, rememberMe });
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      console.log('Register:', { name, email, password, role, college });
    }
  };

  // Determine animation classes
  const getFormAnimationClass = () => {
    if (!isAnimating) return 'form-card-enter-active';
    return slideDirection === 'right' 
      ? 'form-card-exit-left' 
      : 'form-card-exit-right';
  };

  return (
    <div className="auth-container">
      {/* Left Section - Branding */}
      <div className="brand-section">
        <div className="brand-content">
          <div className="stats-badge">
            <span className="stats-number">340+</span>
            <span className="stats-text">Active Events</span>
          </div>
          
          <h1 className="brand-title">
            Your Campus.
            <br />
            <span className="brand-highlight">Every Event.</span>
            <br />
            One Hub.
          </h1>
          
          <p className="brand-description">
            Discover hackathons, sports meets, cultural fests and more across 120+ colleges. 
            Register instantly. Connect deeply.
          </p>
          
          <div className="student-count">
            <span className="count-number">50,000+</span>
            <span className="count-text">students already on board</span>
          </div>
          
          <div className="feature-tags">
            <span className="feature-tag">Sports Meet</span>
            <span className="feature-tag">Hackathon</span>
            <span className="feature-tag">100+ Colleges</span>
          </div>
        </div>
      </div>

      {/* Right Section - Form with Slide Animation */}
      <div className="form-section">
        <div className={`form-card ${getFormAnimationClass()}`}>
          {/* Mode Indicator with Slide */}
          <div className="mode-indicator">
            <div 
              className={`mode-tab ${currentMode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Sign In
            </div>
            <div 
              className={`mode-tab ${currentMode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Sign Up
            </div>
            <div 
              className="mode-slider"
              style={{
                transform: `translateX(${currentMode === 'login' ? '0' : '100%'})`
              }}
            />
          </div>

          {/* Form Container with Slide Animation */}
          <div className="form-container">
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Registration Fields */}
              {currentMode === 'register' && (
                <div className="form-fields register-fields">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="college">College</label>
                    <input
                      type="text"
                      id="college"
                      placeholder="Your College Name"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="admin">College Admin</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Common Fields - Always Visible */}
              <div className="form-fields common-fields">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder={currentMode === 'login' ? "Enter your password" : "Create a password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Confirm Password for Registration */}
                {currentMode === 'register' && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              
              {/* Login Options */}
              {currentMode === 'login' && (
                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </a>
                </div>
              )}
              
              <button type="submit" className="sign-in-btn">
                {currentMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
          
          {/* Social Login */}
          <div className="social-login">
            <div className="divider">
              <span>or continue with</span>
            </div>
            
            <div className="social-buttons">
              <button className="social-btn google-btn" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="social-btn github-btn" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </div>
        
        <div className="language-selector">
          <span>ENG</span>
          <span className="separator">|</span>
          <span>IN</span>
          <span className="battery-icon">74%</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;