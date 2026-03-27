import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CommentsSection from '../components/CommentsSection';
import '../styles/dashboard.css';
import './EventDiscussion.css';

const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';

const EventDiscussion = () => {
    const { registrationId, eventId } = useParams();
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [registration, setRegistration] = useState(null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    
    const isAdmin = user?.role === 'admin';

    // Feedback form state
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState({
        eventExperience: '',
        dissatisfactions: '',
        improvements: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (registrationId) {
                    // Student view via registration
                    const res = await fetch(`${API_URL}/api/registrations/${registrationId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setRegistration(data);
                        setEvent(data.event);
                        if (data.rating) setRating(data.rating);
                        if (data.feedback) setFeedback(data.feedback);
                    } else {
                        navigate('/registrations');
                    }
                } else if (eventId) {
                    // Admin view via direct event ID
                    const res = await fetch(`${API_URL}/api/events/${eventId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setEvent(data);
                    } else {
                        navigate(isAdmin ? '/admin' : '/registrations');
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token && (registrationId || eventId)) fetchData();
    }, [registrationId, eventId, token, navigate, isAdmin]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setSubmittingFeedback(true);
        try {
            const response = await fetch(`${API_URL}/api/registrations/${registrationId}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, feedback })
            });

            if (response.ok) {
                const data = await response.json();
                setRegistration(data.registration);
                alert("Thank you for your feedback!");
            } else {
                const errorData = await response.json();
                alert(errorData.msg || "Failed to submit feedback");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loading) return <div className="loading-disc">Loading workspace...</div>;
    if (!event) return null;

    const isFeedbackSubmitted = isAdmin || !!registration?.rating;

    return (
        <div className="dashboard-container discussion-page-root">
            <Sidebar role={isAdmin ? "admin" : "student"} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="main-content">
                <Header 
                    userName={user?.name || "User"} 
                    userRole={isAdmin ? "Admin" : "Student"} 
                    id={user?.id}
                    onToggle={() => setSidebarOpen(true)}
                />

                <div className="split-container">
                    {/* LEFT SIDE: Image + Feedback */}
                    <div className="discussion-left">
                        <div className="event-info-glass">
                            <div className="event-image-container">
                                {event.image ? (
                                    <img src={event.image.startsWith('http') ? event.image : `${API_URL}/uploads/${event.image}`} alt={event.title} />
                                ) : (
                                    <div className="event-image-placeholder">📅</div>
                                )}
                                <div className="event-overlay-title">
                                    <h2>{event.title}</h2>
                                    <p>{new Date(event.eventDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <div className="feedback-container">
                                {isAdmin ? (
                                    <div className="submitted-feedback-view">
                                        <h3>Admin View</h3>
                                        <p style={{ color: '#94a3b8' }}>You are managing this event's discussion. View participant feedback in the Admin Dashboard.</p>
                                        <div className="status-tag attended" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>ORGANIZER</div>
                                    </div>
                                ) : isFeedbackSubmitted ? (
                                    <div className="submitted-feedback-view">
                                        <div className="feedback-header">
                                            <h3>Your Event Feedback</h3>
                                            <div className="star-display">
                                                {"★".repeat(registration?.rating || 0)}{"☆".repeat(5-(registration?.rating || 0))}
                                            </div>
                                        </div>
                                        
                                        <div className="feedback-item">
                                            <label>Experience</label>
                                            <p>{registration?.feedback?.eventExperience || "N/A"}</p>
                                        </div>
                                        <div className="feedback-item">
                                            <label>Dissatisfactions</label>
                                            <p>{registration?.feedback?.dissatisfactions || "N/A"}</p>
                                        </div>
                                        <div className="feedback-item">
                                            <label>Improvements</label>
                                            <p>{registration?.feedback?.improvements || "N/A"}</p>
                                        </div>
                                        <div className="status-tag attended">ATTENDED</div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleFeedbackSubmit} className="feedback-form-v2">
                                        <h3>Share your experience first</h3>
                                        <div className="star-rating-input">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span 
                                                    key={star} 
                                                    onClick={() => setRating(star)}
                                                    className={star <= rating ? 'star active' : 'star'}
                                                >★</span>
                                            ))}
                                        </div>
                                        
                                        <div className="input-group-v2">
                                            <label>Overall Experience</label>
                                            <textarea 
                                                required
                                                value={feedback.eventExperience}
                                                onChange={(e) => setFeedback({...feedback, eventExperience: e.target.value})}
                                                placeholder="What did you think of the event?"
                                            />
                                        </div>
                                        <div className="input-group-v2">
                                            <label>Any Dissatisfactions?</label>
                                            <textarea 
                                                value={feedback.dissatisfactions}
                                                onChange={(e) => setFeedback({...feedback, dissatisfactions: e.target.value})}
                                                placeholder="Was anything not up to par?"
                                            />
                                        </div>
                                        <div className="input-group-v2">
                                            <label>Suggestions for Improvement</label>
                                            <textarea 
                                                value={feedback.improvements}
                                                onChange={(e) => setFeedback({...feedback, improvements: e.target.value})}
                                                placeholder="How can we do better?"
                                            />
                                        </div>
                                        <button type="submit" disabled={submittingFeedback} className="submit-feedback-btn">
                                            {submittingFeedback ? 'Submitting...' : 'Submit Feedback & Unlock Discussion'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Discussion */}
                    <div className="discussion-right">
                        {!isFeedbackSubmitted ? (
                            <div className="discussion-locked">
                                <span className="lock-icon">🔒</span>
                                <h3>Discussion is Locked</h3>
                                <p>Please submit your feedback first to join the community discussion.</p>
                            </div>
                        ) : (
                            <div className="comments-wrapper-v2">
                                <CommentsSection eventId={event._id} eventTitle={event.title} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EventDiscussion;
