import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const events = [
    {
      date: "March 15, 2026",
      title: "National Hackathon 2026",
      description: "24-hour coding competition solving real-world problems with cutting-edge technology.",
      category: "Technology",
      location: "Virtual + On-Campus",
      icon: "💻",
      color: "#4f46e5"
    },
    {
      date: "April 2, 2026",
      title: "Inter-College Sports Meet",
      description: "Compete in football, cricket, athletics, basketball and more across 15+ colleges.",
      category: "Sports",
      location: "University Sports Complex",
      icon: "🏆",
      color: "#10b981"
    },
    {
      date: "April 20, 2026",
      title: "Cultural Fest 2026",
      description: "Three days of music, dance, drama, and creative performances from across the nation.",
      category: "Cultural",
      location: "Main Auditorium",
      icon: "🎭",
      color: "#ec4899"
    }
  ];

  return (
    <div className="home-container">
      {/* Header */}
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo">CampusEventHub</div>

          <nav className="nav-menu">
            <a href="/">Home</a>
            <a href="/events">Events</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="header-right">
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📷</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">🔗</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
            </div>
            <button className="btn btn-primary btn-small" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="gradient-text">CampusEventHub</span>
            </h1>
            <p className="hero-description">
              Discover and participate in inter-college events — from hackathons
              to sports tournaments and cultural festivals. Connect with 50,000+
              students across 100+ colleges.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-large" onClick={() => navigate('/login')}>
                Explore Events
                <span className="btn-icon">→</span>
              </button>
              <button className="btn btn-secondary btn-large">
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Colleges</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
        <div className="hero-bg-shape"></div>
        <div className="hero-bg-shape-2"></div>
        <div className="hero-bg-shape-3"></div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <span className="section-tag">Why Choose Us</span>
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">Connect, compete, and grow with students from across the country</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: '#eef2ff' }}>
              <span className="feature-icon" style={{ color: '#4f46e5' }}>👥</span>
            </div>
            <h3>Connect & Network</h3>
            <p>Meet students from different colleges and build your professional network.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: '#fef3c7' }}>
              <span className="feature-icon" style={{ color: '#d97706' }}>🏆</span>
            </div>
            <h3>Win Prizes</h3>
            <p>Compete for exciting prizes, certificates, and recognition.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: '#e0f2fe' }}>
              <span className="feature-icon" style={{ color: '#0284c7' }}>💡</span>
            </div>
            <h3>Learn & Grow</h3>
            <p>Participate in workshops, seminars, and hands-on sessions.</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="events">
        <div className="section-header">
          <span className="section-tag">Featured Events</span>
          <h2 className="section-title">Upcoming & Important Events</h2>
          <p className="section-subtitle">Join thousands of students in these exciting upcoming events</p>
        </div>
        <div className="events-grid">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <div className="event-icon" style={{ background: event.color + '15', color: event.color }}>
                {event.icon}
              </div>
              <div className="event-date">
                <span className="date-icon">📅</span>
                {event.date}
              </div>
              <div className="event-location">
                <span className="location-icon">📍</span>
                {event.location}
              </div>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-footer">
                <span className="event-category" style={{ background: event.color + '20', color: event.color }}>
                  {event.category}
                </span>
                <button className="event-link" onClick={() => navigate('/login')}>
                  Register Now
                  <span className="event-link-icon">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all">
          <button className="btn btn-outline">
            View All Events
            <span className="btn-icon">→</span>
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-description">
            Join CampusEventHub today and never miss out on exciting events from colleges across the country.
          </p>
          <button className="btn btn-white btn-large" onClick={() => navigate('/login')}>
            Create Free Account
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="section-header">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">We'd Love to Hear From You</h2>
          <p className="section-subtitle">Have questions? Our team is here to help.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h4>Call Us</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <h4>Email Us</h4>
                <p>team@campuseventhub.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div className="contact-details">
                <h4>Visit Us</h4>
                <p>Bengaluru, India</p>
              </div>
            </div>
          </div>
          <div className="social-grid">
            <a href="https://instagram.com" className="social-card" style={{ background: 'linear-gradient(45deg, #f09433, #d62976, #962fbf)' }}>
              <span className="social-icon">📷</span>
              <span className="social-name">Instagram</span>
              <span className="social-handle">@campuseventhub</span>
            </a>
            <a href="https://linkedin.com" className="social-card" style={{ background: '#0077b5' }}>
              <span className="social-icon">🔗</span>
              <span className="social-name">LinkedIn</span>
              <span className="social-handle">CampusEventHub</span>
            </a>
            <a href="https://twitter.com" className="social-card" style={{ background: '#1DA1F2' }}>
              <span className="social-icon">🐦</span>
              <span className="social-name">Twitter</span>
              <span className="social-handle">@campuseventhub</span>
            </a>
            <a href="https://github.com" className="social-card" style={{ background: '#24292e' }}>
              <span className="social-icon">🐙</span>
              <span className="social-name">GitHub</span>
              <span className="social-handle">campuseventhub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">CampusEventHub</h3>
            <p className="footer-description">
              Connecting students across colleges through events, competitions, and cultural activities.
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/events">Events</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="footer-social">
              <a href="https://instagram.com">📷</a>
              <a href="https://linkedin.com">🔗</a>
              <a href="https://twitter.com">🐦</a>
              <a href="https://github.com">🐙</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 CampusEventHub | Developed by Team 3 | All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;