import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './MyRegistrations.css';

const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';

const getSafeImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80';
    if (image.startsWith('http')) return image;
    return `${API_URL}/uploads/${encodeURIComponent(image)}`;
};

const CATEGORIES = [
    { id: 'all', name: 'All', emoji: '🌟' },
    { id: 'tech', name: 'Technology', emoji: '💻' },
    { id: 'music', name: 'Music & Arts', emoji: '🎸' },
    { id: 'education', name: 'Education', emoji: '📚' },
    { id: 'networking', name: 'Networking', emoji: '🤝' },
    { id: 'sports', name: 'Sports', emoji: '⚽' }
];

const MyRegistrations = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [studentProfile, setStudentProfile] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const toggleSidebar = useCallback(() => setSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);
    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        completed: 0
    });

    const [feedbackModal, setFeedbackModal] = useState({ 
        isOpen: false, 
        regId: null, 
        rating: 5, 
        feedback: { eventExperience: '', dissatisfactions: '', improvements: '' } 
    });
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) return;
            try {
                const profileRes = await fetch(`${API_URL}/api/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setStudentProfile(profileData);
                }

                setLoading(true);
                const response = await fetch(`${API_URL}/api/registrations/my-registrations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const validRegs = data
                        .filter(reg => reg.event && reg.event._id)
                        .map(reg => ({
                            ...reg,
                            event: {
                                ...reg.event,
                                image: getSafeImageUrl(reg.event.image)
                            }
                        }));
                    setRegistrations(validRegs);

                    const now = new Date();
                    const tot = validRegs.length;
                    const up = validRegs.filter(r => new Date(r.event.eventDate) > now).length;
                    const cp = tot - up;
                    setStats({ total: tot, upcoming: up, completed: cp });
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    const filteredRegistrations = (registrations || []).filter(reg => {
        const matchesCategory = selectedCategory === 'all' || reg.event.category === selectedCategory;
        const matchesSearch = !searchTerm || 
            reg.event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.event.location?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCatColor = (catId) => {
        const colors = {
            tech: '#6366f1',
            music: '#ec4899',
            education: '#10b981',
            networking: '#f59e0b',
            sports: '#3b82f6',
            all: '#a855f7'
        };
        return colors[catId] || '#6366f1';
    };

    const handleFeedbackSubmit = async () => {
        if (!feedbackModal.regId || !token) return;
        setSubmittingFeedback(true);
        try {
            const response = await fetch(`${API_URL}/api/registrations/${feedbackModal.regId}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rating: feedbackModal.rating,
                    feedback: feedbackModal.feedback
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Update local state registrations to show the new feedback immediately
                setRegistrations(prevRegistrations => 
                    prevRegistrations.map(reg => {
                        if (reg._id === feedbackModal.regId) {
                            return { ...reg, rating: data.registration.rating, feedback: data.registration.feedback, status: data.registration.status };
                        }
                        return reg;
                    })
                );
                
                // Close modal
                setFeedbackModal({ 
                    isOpen: false, 
                    regId: null, 
                    rating: 5, 
                    feedback: { eventExperience: '', dissatisfactions: '', improvements: '' } 
                });
                alert("Thank you for your feedback!");
            } else {
                const errData = await response.json();
                alert(errData.msg || "Error submitting feedback");
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting feedback. Please try again.");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="student" isOpen={sidebarOpen} onClose={closeSidebar} />

            <main className="main-content">
                <Header
                    userName={studentProfile?.name || user?.name || "Student"}
                    userRole="Student"
                    id={user?.id}
                    onToggle={toggleSidebar}
                />

                <div className="myreg-content-wrapper">
                    {/* Page Title */}
                    <div className="myreg-page-title">
                        <div>
                            <h1>📋 My Registrations</h1>
                            <p>Track and manage all your event registrations</p>
                        </div>
                    </div>

                    {/* Toolbar: Filters + Results Count */}
                    <div className="myreg-toolbar">
                        <div className="myreg-filters">
                            <input
                                type="text"
                                placeholder="🔍 Search registrations..."
                                className="myreg-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '50px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    marginRight: '16px',
                                    outline: 'none',
                                    width: '250px'
                                }}
                            />
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`myreg-chip ${selectedCategory === cat.id ? 'myreg-chip--active' : ''}`}
                                >
                                    <span>{cat.emoji}</span>
                                    <span>{cat.name}</span>
                                    {selectedCategory === cat.id && (
                                        <span className="myreg-chip__count">
                                            {filteredRegistrations.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <span className="myreg-results-label">
                            {filteredRegistrations.length} registration{filteredRegistrations.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="myreg-loading">
                            <div className="spinner"></div>
                            <p>Loading your registrations...</p>
                        </div>
                    ) : filteredRegistrations.length === 0 ? (
                        <div className="myreg-empty">
                            <div className="myreg-empty__icon">📅</div>
                            <h3>No registrations found</h3>
                            <p>
                                {selectedCategory === 'all'
                                    ? "You haven't registered for any events yet. Discover exciting events to get started!"
                                    : "No registrations in this category. Try exploring other categories or browse all events."}
                            </p>
                            <button
                                className="myreg-empty__btn"
                                onClick={() => selectedCategory === 'all' ? navigate('/events') : setSelectedCategory('all')}
                            >
                                {selectedCategory === 'all' ? '🔍 Explore Events' : '← View All Categories'}
                            </button>
                        </div>
                    ) : (
                        <div className="myreg-grid">
                            {filteredRegistrations.map((reg, idx) => {
                                const event = reg.event;
                                const isUpcoming = new Date(event.eventDate) > new Date();
                                return (
                                    <div key={reg._id || idx} className="myreg-card">
                                        <div className="myreg-card__img">
                                            <div
                                                className="myreg-card__img-inner"
                                                style={{ backgroundImage: `url(${event.image})` }}
                                            />
                                            <span
                                                className="myreg-card__cat-badge"
                                                style={{ background: getCatColor(event.category) }}
                                            >
                                                {CATEGORIES.find(c => c.id === event.category)?.emoji || '📅'}{' '}
                                                {CATEGORIES.find(c => c.id === event.category)?.name || event.category}
                                            </span>
                                            <span className={`myreg-card__status-badge ${isUpcoming ? 'myreg-card__status-badge--upcoming' : 'myreg-card__status-badge--done'}`}>
                                                {isUpcoming ? '🕒 UPCOMING' : '✅ COMPLETED'}
                                            </span>
                                        </div>

                                        <div className="myreg-card__body">
                                            <h3 className="myreg-card__title">{event.title}</h3>
                                            <p className="myreg-card__desc">
                                                {event.description?.substring(0, 110)}...
                                            </p>

                                            <div className="myreg-card__meta">
                                                <div className="myreg-meta-row">
                                                    <span className="myreg-meta-icon">📅</span>
                                                    <span>{new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="myreg-meta-row">
                                                    <span className="myreg-meta-icon">📍</span>
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>

                                             <div className="myreg-card__footer">
                                                <div className="myreg-price-box">
                                                    <span className="myreg-price-label">Ticket Price</span>
                                                    <span className="myreg-price-value">
                                                        {event.ticketPrice ? `₹${event.ticketPrice}` : 'Free'}
                                                    </span>
                                                </div>
                                                <div className="myreg-card__confirmed" style={{
                                                    color: reg.status === 'accepted' ? '#22c55e' : reg.status === 'rejected' ? '#ef4444' : '#ffab00',
                                                    background: reg.status === 'accepted' ? 'rgba(34, 197, 94, 0.1)' : reg.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 171, 0, 0.1)',
                                                    border: reg.status === 'accepted' ? '1px solid rgba(34, 197, 94, 0.2)' : reg.status === 'rejected' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255, 171, 0, 0.2)',
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                    fontWeight: '700',
                                                    fontSize: '11px'
                                                }}>
                                                    <span style={{ fontSize: '10px', marginRight: '4px' }}>●</span> 
                                                    {reg.status?.toUpperCase() || 'PENDING'}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                                <button
                                                    className="myreg-card__btn"
                                                    style={{ flex: 1 }}
                                                    onClick={() => navigate('/events')}
                                                >
                                                    View Details →
                                                </button>
                                                {!isUpcoming && (reg.status === 'accepted' || reg.status === 'attended') && !reg.rating && (
                                                    <button
                                                        className="myreg-card__btn"
                                                        style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none' }}
                                                        onClick={() => setFeedbackModal({ isOpen: true, regId: reg._id, rating: 5, feedback: { eventExperience: '', dissatisfactions: '', improvements: '' } })}
                                                    >
                                                        ⭐ Feedback
                                                    </button>
                                                )}
                                            </div>
                                            {!isUpcoming && reg.rating && (
                                                <div style={{marginTop: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--c-border)'}}>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <span style={{color: '#fbbf24', marginRight: '6px', fontSize: '14px', letterSpacing: '2px'}}>{"★".repeat(reg.rating)}{"☆".repeat(5-reg.rating)}</span>
                                                        <span style={{fontSize: '11px', color: 'var(--text-gray)', fontWeight: '600', textTransform: 'uppercase'}}>Your Rating Submitted</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Feedback Modal */}
                {feedbackModal.isOpen && (
                    <div className="feedback-modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                        background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
                    }}>
                        <div className="feedback-modal-content" style={{
                            background: 'var(--bg-main)', width: '90%', maxWidth: '400px', 
                            borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                            border: '1px solid var(--c-border)'
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>Rate Your Experience</h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '20px' }}>Your feedback helps us improve future events.</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFeedbackModal({...feedbackModal, rating: star})}
                                        style={{ 
                                            background: 'none', border: 'none', 
                                            fontSize: '32px', cursor: 'pointer',
                                            color: star <= feedbackModal.rating ? '#fbbf24' : '#e2e8f0',
                                            transition: 'color 0.2s'
                                        }}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px', marginBottom: '20px' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '6px' }}>How was the event?</label>
                                    <textarea
                                        value={feedbackModal.feedback.eventExperience}
                                        onChange={(e) => setFeedbackModal({...feedbackModal, feedback: {...feedbackModal.feedback, eventExperience: e.target.value}})}
                                        placeholder="Describe your overall experience..."
                                        style={{
                                            width: '100%', height: '80px', padding: '12px',
                                            borderRadius: '8px', border: '1px solid var(--c-border)',
                                            background: 'rgba(255,255,255,0.03)', color: 'var(--text-dark)',
                                            resize: 'none', outline: 'none',
                                            fontSize: '14px', fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '6px' }}>Were there any aspects you were not satisfied with?</label>
                                    <textarea
                                        value={feedbackModal.feedback.dissatisfactions}
                                        onChange={(e) => setFeedbackModal({...feedbackModal, feedback: {...feedbackModal.feedback, dissatisfactions: e.target.value}})}
                                        placeholder="Please let us know..."
                                        style={{
                                            width: '100%', height: '80px', padding: '12px',
                                            borderRadius: '8px', border: '1px solid var(--c-border)',
                                            background: 'rgba(255,255,255,0.03)', color: 'var(--text-dark)',
                                            resize: 'none', outline: 'none',
                                            fontSize: '14px', fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '6px' }}>How can we improve future events?</label>
                                    <textarea
                                        value={feedbackModal.feedback.improvements}
                                        onChange={(e) => setFeedbackModal({...feedbackModal, feedback: {...feedbackModal.feedback, improvements: e.target.value}})}
                                        placeholder="Specific suggestions..."
                                        style={{
                                            width: '100%', height: '80px', padding: '12px',
                                            borderRadius: '8px', border: '1px solid var(--c-border)',
                                            background: 'rgba(255,255,255,0.03)', color: 'var(--text-dark)',
                                            resize: 'none', outline: 'none',
                                            fontSize: '14px', fontFamily: 'inherit'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setFeedbackModal({ isOpen: false, regId: null, rating: 5, feedback: { eventExperience: '', dissatisfactions: '', improvements: '' } })}
                                    style={{
                                        flex: 1, padding: '10px', background: 'transparent',
                                        border: '1px solid var(--c-border)', borderRadius: '8px',
                                        color: 'var(--text-gray)', fontWeight: '600', cursor: 'pointer'
                                    }}
                                    disabled={submittingFeedback}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFeedbackSubmit}
                                    style={{
                                        flex: 2, padding: '10px', background: 'var(--primary, #6366f1)',
                                        border: 'none', borderRadius: '8px', color: 'white', 
                                        fontWeight: '600', cursor: 'pointer',
                                        opacity: submittingFeedback ? 0.7 : 1
                                    }}
                                    disabled={submittingFeedback}
                                >
                                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyRegistrations;
