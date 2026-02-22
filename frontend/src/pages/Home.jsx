import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Chatbot from '../components/chatbot';

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
      description: "Compete with top developers, solve real-world challenges, and win exciting prizes and recognition.",
      category: "Technology",
      icon: "💻"
    },
    {
      date: "April 2, 2026",
      title: "Inter-College Sports Meet",
      description: "Compete in football, cricket, athletics, basketball and more across 15+ colleges.",
      category: "Sports",
      icon: "🏆"
    },
    {
      date: "April 20, 2026",
      title: "Cultural Fest 2026",
      description: "Three days of music, dance, drama, and creative performances from across the nation.",
      category: "Cultural",
      icon: "🎭"
    }
  ];

  return (
    <div className="home-container">
      {/* Header - UPDATED WITH PROPER SPACING */}
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">CampusEventHub</div>
          </div>
          
          <nav className="nav-menu">
            <a href="/">Home</a>
            <a href="/events">Events</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          
          <div className="header-right">
            <button className="btn btn-primary btn-small" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          {/* title spans full width but included in left column */}
          <div className="hero-left">
            <h1 className="hero-title">
              <span className="gradient-text">CampusEventHub</span>
            </h1>
            <p className="hero-description">
              Discover and participate in inter-college events—from hackathons to sports tournaments and cultural festivals. Connect with 50,000+ students across 100+ colleges.
            </p>
          </div>

          {/* right column: buttons only */}
          <div className="hero-right">
            <div className="hero-buttons">
              <button className="btn btn-primary btn-large" onClick={() => navigate('/events')}>
                Explore Events
              </button>
              <button className="btn btn-secondary btn-large" onClick={() => navigate('/about')}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">Connect, compete, and grow with students from across the country</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Connect & Network</h3>
            <p>Meet students from different colleges and build your professional network at hackathons and events.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Win Prizes</h3>
            <p>Compete with students and win prizes, certificates, and recognition at national level events.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Learn & Grow</h3>
            <p>Participate in workshops, seminars, and hands-on sessions to enhance your skills.</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="events">
        <div className="section-header">
          <h2 className="section-title">Upcoming & Important Events</h2>
          <p className="section-subtitle">Join thousands of students in these exciting upcoming events</p>
        </div>
        
        <div className="events-grid">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <div className="event-icon">{event.icon}</div>
              <div className="event-date">📅 {event.date}</div>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-footer">
                <span className="event-category">{event.category}</span>
                <button className="event-link" onClick={() => navigate('/events')}>
                  Register Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-description">
            Join CampusEventHub today and never miss out on exciting events from colleges across the country.
          </p>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/signup')}>
            Create Free Account
          </button>
        </div>
      </section>

      {/* Contact Section - UPDATED with clickable social links */}
      <section className="contact" id="contact">
        <div className="section-header">
          <h2 className="section-title">We'd Love to Hear From You</h2>
        </div>
        
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h4>Call Us</h4>
                <p>+91 90675 43210</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📧</div>
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
          
          <div className="social-links">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-item">
              <span className="social-icon">📷</span>
              <span className="social-handle">@campuseventhub</span>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-item">
              <span className="social-icon">🔗</span>
              <span className="social-handle">@CampusEventHub</span>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-item">
              <span className="social-icon">🐦</span>
              <span className="social-handle">@campuseventhub</span>
            </a>
            <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="social-item">
              <span className="social-icon">🐙</span>
              <span className="social-handle">@campuseventhub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer - UPDATED with proper links */}
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
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">📷</a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">🔗</a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 CampusEventHub | All rights reserved.</p>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

export default Home;