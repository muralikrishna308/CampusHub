import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Chatbot from '../components/chatbot';

const useCounter = (end, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
};

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const EVENTS = [
  { date: "Mar 15, 2026", title: "National Hackathon 2026", desc: "Compete with top developers, solve real-world challenges.", cat: "Technology", icon: "💻", color: "#667eea" },
  { date: "Apr 2, 2026", title: "Inter-College Sports Meet", desc: "Football, cricket, athletics & basketball across 15+ colleges.", cat: "Sports", icon: "🏆", color: "#764ba2" },
  { date: "Apr 20, 2026", title: "Cultural Fest 2026", desc: "Three days of music, dance, drama & creative performances.", cat: "Cultural", icon: "🎭", color: "#a855f7" },
  { date: "May 5, 2026", title: "AI Summit & Expo", desc: "Industry leaders, workshops, and hands-on AI sessions.", cat: "Technology", icon: "🤖", color: "#667eea" },
  { date: "May 18, 2026", title: "E-Sports Championship", desc: "Battle in PUBG, Valorant, and FIFA brackets.", cat: "Gaming", icon: "🎮", color: "#764ba2" },
];

const TESTIMONIALS = [
  { name: "Aryan Sharma", college: "IIT Bombay", avatar: "🧑‍💻", text: "CampusEventHub helped me network with 200+ developers at Hackathon 2025. Landed my first internship because of those connections!" },
  { name: "Priya Nair", college: "NIT Calicut", avatar: "👩‍🎤", text: "The Cultural Fest registration was seamless. I got real-time updates and never missed a single performance schedule." },
  { name: "Rahul Verma", college: "VIT Vellore", avatar: "🧑‍🏫", text: "Using this platform as an event organiser was a game-changer. The dashboard analytics are super insightful." },
  { name: "Sneha Iyer", college: "Delhi University", avatar: "👩‍🔬", text: "Found three events in my city I didn't even know existed. The filters are incredibly useful." },
];

const FEATURES_BENTO = [
  { icon: "🗺️", title: "Discover Nearby", desc: "Location-aware event discovery across 100+ campuses.", span: "wide", gradient: "linear-gradient(135deg,#667eea,#764ba2)" },
  { icon: "🔔", title: "Smart Alerts", desc: "Instant notifications for registrations & updates.", span: "tall", gradient: "linear-gradient(135deg,#764ba2,#a855f7)" },
  { icon: "🎟️", title: "1-Click Register", desc: "Register for any event in seconds.", span: "normal", gradient: "linear-gradient(135deg,#5a67d8,#667eea)" },
  { icon: "📊", title: "Live Dashboard", desc: "Track registrations, tickets & team analytics.", span: "normal", gradient: "linear-gradient(135deg,#667eea,#a855f7)" },
  { icon: "🤝", title: "Team Builder", desc: "Find teammates and form squads for competitions.", span: "wide", gradient: "linear-gradient(135deg,#764ba2,#667eea)" },
];

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setTestimonial] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* ── per-section reveal refs ── */
  const [statsRef, statsInView] = useInView(0.3);
  const [featuresRef, featuresInView] = useInView(0.1);
  const [eventsRef, eventsInView] = useInView(0.1);
  const [howRef, howInView] = useInView(0.15);
  const [testiRef, testiInView] = useInView(0.15);
  const [ctaRef, ctaInView] = useInView(0.2);
  const [contactRef, contactInView] = useInView(0.1);

  /* animated counters (fire once statsInView) */
  const students = useCounter(50000, 2200, statsInView);
  const colleges = useCounter(120, 1800, statsInView);
  const events = useCounter(340, 2000, statsInView);
  const prizes = useCounter(500, 2400, statsInView);

  /* scroll & mouse */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    const onMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMouse);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  /* testimonial auto-rotate */
  useEffect(() => {
    const t = setInterval(() => setTestimonial(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  /* smooth scroll to anchor */
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="lp-root">
      {/* ── Cursor glow ── */}
      <div className="lp-cursor-glow" style={{ left: mousePos.x, top: mousePos.y }} />

      {/*NAVBAR */}
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav__inner">
          <button className="lp-nav__logo" onClick={() => scrollTo('top')}>
            <span className="lp-nav__logomark">✦</span>
            Campus<span className="lp-nav__logo-accent">Event</span>Hub
          </button>

          <nav className={`lp-nav__links ${menuOpen ? 'lp-nav__links--open' : ''}`}>
            {['features', 'events', 'testimonials', 'contact'].map(s => (
              <button key={s} className="lp-nav__link" onClick={() => scrollTo(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </nav>

          <div className="lp-nav__cta">
            <button className="lp-btn lp-btn--ghost" onClick={() => navigate('/login')}>Sign In</button>
            <button className="lp-btn lp-btn--primary" onClick={() => navigate('/register')}>Get Started →</button>
          </div>

          <button
            className={`lp-nav__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/*HERO */}
      <section id="top" className="lp-hero">
        <div className="lp-hero__orb lp-hero__orb--1" />
        <div className="lp-hero__orb lp-hero__orb--2" />
        <div className="lp-hero__orb lp-hero__orb--3" />

        <div className="lp-hero__inner">
          {/* LEFT — staggered fade-up on mount */}
          <div className="lp-hero__left">
            <div className="lp-hero__badge lp-anim lp-anim--fade-up" style={{ '--delay': '0ms' }}>
              <span className="lp-badge__dot" /> 340+ Active Events
            </div>

            <h1 className="lp-hero__heading lp-anim lp-anim--fade-up" style={{ '--delay': '120ms' }}>
              Your Campus.<br />
              <span className="lp-hero__gradient-word">Every Event.</span><br />
              One Hub.
            </h1>

            <p className="lp-hero__sub lp-anim lp-anim--fade-up" style={{ '--delay': '220ms' }}>
              Discover hackathons, sports meets, cultural fests and more across
              120+ colleges. Register instantly. Connect deeply.
            </p>

            <div className="lp-hero__actions lp-anim lp-anim--fade-up" style={{ '--delay': '320ms' }}>
              <button className="lp-btn lp-btn--primary lp-btn--lg" onClick={() => navigate('/register')}>
                Join Free — It's Instant ✦
              </button>
              <button className="lp-btn lp-btn--outline lp-btn--lg" onClick={() => scrollTo('events')}>
                Browse Events
              </button>
            </div>

            <div className="lp-hero__proof lp-anim lp-anim--fade-up" style={{ '--delay': '420ms' }}>
              <div className="lp-hero__avatars">
                {['🧑‍💻', '👩‍🎤', '🧑‍🏫', '👩‍🔬', '🧑‍🎓'].map((a, i) => (
                  <span key={i} className="lp-hero__avatar">{a}</span>
                ))}
              </div>
              <p className="lp-hero__proof-text">
                <strong>50,000+</strong> students already on board
              </p>
            </div>
          </div>

          {/* RIGHT — mosaic slides in from right */}
          <div className="lp-hero__right lp-anim lp-anim--fade-right" style={{ '--delay': '200ms' }}>
            <div className="lp-hero__mosaic">
              <div className="lp-mosaic-card lp-mosaic-card--main">
                <div className="lp-mosaic-card__icon">💻</div>
                <div className="lp-mosaic-card__body">
                  <p className="lp-mosaic-card__label">UPCOMING</p>
                  <h3 className="lp-mosaic-card__title">National Hackathon</h3>
                  <p className="lp-mosaic-card__date">Mar 15, 2026</p>
                  <span className="lp-mosaic-card__badge">Technology</span>
                </div>
              </div>
              <div className="lp-mosaic-card lp-mosaic-card--sm lp-mosaic-card--sports">
                <div className="lp-mosaic-card__icon">🏆</div>
                <p className="lp-mosaic-card__title">Sports Meet</p>
              </div>
              <div className="lp-mosaic-card lp-mosaic-card--sm lp-mosaic-card--culture">
                <div className="lp-mosaic-card__icon">🎭</div>
                <p className="lp-mosaic-card__title">Cultural Fest</p>
              </div>
              <div className="lp-mosaic-card lp-mosaic-card--stat">
                <span className="lp-mosaic-stat">120+</span>
                <p>Colleges</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-hero__scroll-cue" onClick={() => scrollTo('stats')}>
          <div className="lp-scroll-wheel" />
        </div>
      </section>

      {/*STATS BAND */}
      <section
        id="stats"
        className={`lp-stats lp-reveal ${statsInView ? 'lp-reveal--visible' : ''}`}
        ref={statsRef}
      >
        {[
          { val: students, suffix: '+', label: 'Students Connected' },
          { val: colleges, suffix: '+', label: 'Partner Colleges' },
          { val: events, suffix: '+', label: 'Events Hosted' },
          { val: prizes, suffix: 'K', label: 'Prize Pool (₹)' },
        ].map((s, i) => (
          <div
            className={`lp-stat-item lp-stagger ${statsInView ? 'lp-stagger--visible' : ''}`}
            style={{ '--stagger': i }}
            key={i}
          >
            <p className="lp-stat-item__value">
              {s.val.toLocaleString('en-IN')}<span className="lp-stat-item__suffix">{s.suffix}</span>
            </p>
            <p className="lp-stat-item__label">{s.label}</p>
          </div>
        ))}
      </section>

      {/*FEATURES*/}
      <section
        id="features"
        className={`lp-section lp-features lp-reveal ${featuresInView ? 'lp-reveal--visible' : ''}`}
        ref={featuresRef}
      >
        <div className="lp-section__header lp-stagger lp-stagger--visible" style={{ '--stagger': 0 }}>
          <span className="lp-pill">Platform Features</span>
          <h2 className="lp-section__title">Everything You Need<br />to <em>Thrive</em> on Campus</h2>
          <p className="lp-section__sub">From discovery to registration to networking — we've got it all.</p>
        </div>

        <div className="lp-bento">
          {FEATURES_BENTO.map((f, i) => (
            <div
              key={i}
              className={`lp-bento__cell lp-bento__cell--${f.span} lp-stagger ${featuresInView ? 'lp-stagger--visible' : ''}`}
              style={{ '--stagger': i + 1 }}
            >
              <div className="lp-bento__glow" style={{ background: f.gradient }} />
              <div className="lp-bento__icon">{f.icon}</div>
              <h3 className="lp-bento__title">{f.title}</h3>
              <p className="lp-bento__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section
        id="events"
        className={`lp-section lp-events lp-reveal ${eventsInView ? 'lp-reveal--visible' : ''}`}
        ref={eventsRef}
      >
        <div className="lp-section__header lp-stagger lp-stagger--visible" style={{ '--stagger': 0 }}>
          <span className="lp-pill">Don't Miss Out</span>
          <h2 className="lp-section__title">Upcoming Events</h2>
          <p className="lp-section__sub">Hand-picked highlights across colleges this semester.</p>
        </div>

        <div className="lp-events__track-wrap">
          <div className="lp-events__track">
            {EVENTS.map((ev, i) => (
              <div
                key={i}
                className={`lp-event-card lp-stagger ${eventsInView ? 'lp-stagger--visible' : ''}`}
                style={{ '--accent': ev.color, '--stagger': i }}
              >
                <div className="lp-event-card__top">
                  <span className="lp-event-card__icon">{ev.icon}</span>
                  <span className="lp-event-card__cat">{ev.cat}</span>
                </div>
                <h3 className="lp-event-card__title">{ev.title}</h3>
                <p className="lp-event-card__desc">{ev.desc}</p>
                <div className="lp-event-card__footer">
                  <span className="lp-event-card__date">📅 {ev.date}</span>
                  <button className="lp-event-card__btn" onClick={() => navigate('/register')}>
                    Register →
                  </button>
                </div>
                <div className="lp-event-card__bar" />
              </div>
            ))}
          </div>
        </div>

        <div className="lp-events__cta">
          <button className="lp-btn lp-btn--primary lp-btn--lg" onClick={() => navigate('/register')}>
            View All Events
          </button>
        </div>
      </section>

      {/*HOW IT WORKS */}
      <section
        className={`lp-section lp-how lp-reveal ${howInView ? 'lp-reveal--visible' : ''}`}
        ref={howRef}
      >
        <div className="lp-section__header lp-stagger lp-stagger--visible" style={{ '--stagger': 0 }}>
          <span className="lp-pill">Simple Process</span>
          <h2 className="lp-section__title">Up &amp; Running in<br /><em>3 Steps</em></h2>
        </div>

        <div className="lp-steps">
          {[
            { n: '01', icon: '🎓', title: 'Create Your Profile', desc: 'Sign up with your college email in under 60 seconds.' },
            { n: '02', icon: '🔍', title: 'Discover Events', desc: 'Browse, filter and save events tailored to your interests.' },
            { n: '03', icon: '🚀', title: 'Register & Connect', desc: 'One-click registration and instant team-building tools.' },
          ].map((s, i) => (
            <div
              key={i}
              className={`lp-step lp-stagger ${howInView ? 'lp-stagger--visible' : ''}`}
              style={{ '--stagger': i }}
            >
              <div className="lp-step__num">{s.n}</div>
              <div className="lp-step__icon">{s.icon}</div>
              <h3 className="lp-step__title">{s.title}</h3>
              <p className="lp-step__desc">{s.desc}</p>
              {i < 2 && <div className="lp-step__connector" />}
            </div>
          ))}
        </div>
      </section>

      {/*TESTIMONIALS */}
      <section
        id="testimonials"
        className={`lp-section lp-testimonials lp-reveal ${testiInView ? 'lp-reveal--visible' : ''}`}
        ref={testiRef}
      >
        <div className="lp-section__header lp-stagger lp-stagger--visible" style={{ '--stagger': 0 }}>
          <span className="lp-pill">Student Stories</span>
          <h2 className="lp-section__title">Loved by Students<br />Across India</h2>
        </div>

        <div className="lp-testi__stage">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`lp-testi__card ${i === activeTestimonial ? 'lp-testi__card--active' : ''}`}>
              <div className="lp-testi__avatar">{t.avatar}</div>
              <blockquote className="lp-testi__quote">"{t.text}"</blockquote>
              <p className="lp-testi__name">{t.name}</p>
              <p className="lp-testi__college">{t.college}</p>
            </div>
          ))}
        </div>

        <div className="lp-testi__dots">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`lp-testi__dot ${i === activeTestimonial ? 'lp-testi__dot--active' : ''}`}
              onClick={() => setTestimonial(i)}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/*CTA BANNER */}
      <section
        className={`lp-cta-banner lp-reveal ${ctaInView ? 'lp-reveal--visible' : ''}`}
        ref={ctaRef}
      >
        <div className="lp-cta-banner__orb lp-cta-banner__orb--1" />
        <div className="lp-cta-banner__orb lp-cta-banner__orb--2" />
        <div className="lp-cta-banner__inner">
          <h2 className="lp-cta-banner__heading lp-stagger lp-stagger--visible" style={{ '--stagger': 0 }}>
            Ready to Write<br />Your Campus Story?
          </h2>
          <p className="lp-cta-banner__sub lp-stagger lp-stagger--visible" style={{ '--stagger': 1 }}>
            Join 50,000+ students. It's free, forever.
          </p>
          <div className="lp-cta-banner__actions lp-stagger lp-stagger--visible" style={{ '--stagger': 2 }}>
            <button className="lp-btn lp-btn--white lp-btn--lg" onClick={() => navigate('/register')}>
              Create Free Account ✦
            </button>
            <button className="lp-btn lp-btn--ghost-white lp-btn--lg" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/*CONTACT */}
      <section
        id="contact"
        className={`lp-section lp-contact lp-reveal ${contactInView ? 'lp-reveal--visible' : ''}`}
        ref={contactRef}
      >
        <div className="lp-section__header lp-stagger lp-stagger--visible" style={{ '--stagger': 0 }}>
          <span className="lp-pill">Get in Touch</span>
          <h2 className="lp-section__title">We'd Love to<br />Hear From You</h2>
        </div>

        <div className="lp-contact__grid">
          {/* info */}
          <div className="lp-contact__info">
            {[
              { icon: '📞', label: 'Call Us', value: '+91 90675 43210' },
              { icon: '📧', label: 'Email Us', value: 'team@campuseventhub.com' },
              { icon: '📍', label: 'Visit Us', value: 'Bengaluru, India' },
            ].map((c, i) => (
              <div
                key={i}
                className={`lp-contact__item lp-stagger ${contactInView ? 'lp-stagger--visible' : ''}`}
                style={{ '--stagger': i }}
              >
                <div className="lp-contact__icon">{c.icon}</div>
                <div>
                  <p className="lp-contact__item-label">{c.label}</p>
                  <p className="lp-contact__item-value">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* social grid */}
          <div className="lp-socials">
            {[
              { icon: '📷', handle: '@campuseventhub', net: 'Instagram', href: 'https://instagram.com' },
              { icon: '🔗', handle: 'CampusEventHub', net: 'LinkedIn', href: 'https://linkedin.com' },
              { icon: '🐦', handle: '@campuseventhub', net: 'Twitter/X', href: 'https://twitter.com' },
              { icon: '🐙', handle: '@campuseventhub', net: 'GitHub', href: 'https://github.com' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`lp-social-card lp-stagger ${contactInView ? 'lp-stagger--visible' : ''}`}
                style={{ '--stagger': i + 3 }}
              >
                <span className="lp-social-card__icon">{s.icon}</span>
                <span className="lp-social-card__net">{s.net}</span>
                <span className="lp-social-card__handle">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/*FOOTER */}
      <footer className="lp-footer lp-footer--reveal">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <p className="lp-footer__logo">
              <span className="lp-nav__logomark">✦</span>
              Campus<span className="lp-nav__logo-accent">Event</span>Hub
            </p>
            <p className="lp-footer__tagline">Connecting campus. Elevating experiences.</p>
          </div>

          <div className="lp-footer__links">
            <div>
              <p className="lp-footer__col-title">Platform</p>
              {['Events', 'Dashboard', 'Teams', 'Leaderboard'].map(l => (
                <a key={l} href="/" className="lp-footer__link">{l}</a>
              ))}
            </div>
            <div>
              <p className="lp-footer__col-title">Company</p>
              {['About Us', 'Blog', 'Careers', 'Press'].map(l => (
                <a key={l} href="/" className="lp-footer__link">{l}</a>
              ))}
            </div>
            <div>
              <p className="lp-footer__col-title">Legal</p>
              {['Privacy Policy', 'Terms', 'Cookie Policy'].map(l => (
                <a key={l} href="/" className="lp-footer__link">{l}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="lp-footer__bottom">
          <p>© 2026 CampusEventHub — All rights reserved.</p>
          <p className="lp-footer__made">Made with 💜 for students</p>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
};

export default Home;