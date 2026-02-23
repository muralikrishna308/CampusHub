import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Events.css";

// Keep the beautiful event images from first code
const eventImages = {
    tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    music: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600',
    workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
    cultural: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
    default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
};

// Categories from first code
const CATEGORIES = [
    { id: 'all', name: 'All Events', emoji: '🌟' },
    { id: 'tech', name: 'Technology', emoji: '💻' },
    { id: 'music', name: 'Music', emoji: '🎵' },
    { id: 'workshop', name: 'Workshops', emoji: '🛠️' },
    { id: 'cultural', name: 'Cultural', emoji: '🎭' },
    { id: 'sports', name: 'Sports', emoji: '⚽' },
];

const categoryColors = {
    tech: '#4f46e5',
    music: '#db2777',
    workshop: '#ea580c',
    cultural: '#16a34a',
    sports: '#dc2626',
    default: '#6b7280',
};

export default function Events() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [registering, setRegistering] = useState(false);

    // 🔥 Fetch events from backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/api/events");

                // Map backend fields to frontend with proper formatting
                const formattedEvents = res.data.map((event) => ({
                    ...event,
                    // Use category-based image from Unsplash instead of uploaded image
                    // This keeps the beautiful UI consistent
                    image: eventImages[event.category] || eventImages.default,
                    date: event.eventDate || event.date,
                    price: event.ticketPrice ? `₹${event.ticketPrice}` : 'Free',
                    // Ensure these fields exist for the UI
                    speaker: event.speaker || 'TBD',
                    time: event.time || '10:00 AM – 06:00 PM',
                    registered: event.registered || Math.floor(Math.random() * event.capacity),
                }));

                setEvents(formattedEvents);
                
                // Also fetch user's registered events if logged in
                if (user) {
                    fetchUserRegistrations();
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    const fetchUserRegistrations = async () => {
        try {
            // You'll need to create this endpoint
            const res = await axios.get("http://localhost:5000/api/events/my-registrations", {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRegisteredEvents(res.data.map(reg => reg.eventId));
        } catch (error) {
            console.error("Error fetching registrations:", error);
        }
    };

    // Filter events based on search and category
    useEffect(() => {
        let result = events;
        
        if (selectedCategory !== 'all') {
            result = result.filter(e => e.category === selectedCategory);
        }
        
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                e =>
                    e.title?.toLowerCase().includes(term) ||
                    e.description?.toLowerCase().includes(term) ||
                    e.location?.toLowerCase().includes(term) ||
                    (e.speaker && e.speaker.toLowerCase().includes(term))
            );
        }
        
        setFilteredEvents(result);
    }, [searchTerm, selectedCategory, events]);

    const handleRegister = async (eventId) => {
        if (!user) {
            alert('Please login to register for events');
            navigate('/login');
            return;
        }

        try {
            setRegistering(true);
            await axios.post(
                `http://localhost:5000/api/events/${eventId}/register`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            setRegisteredEvents(prev => [...prev, eventId]);
            
            // Update registered count in local state
            setEvents(prevEvents => 
                prevEvents.map(event => 
                    event._id === eventId 
                        ? { ...event, registered: event.registered + 1 }
                        : event
                )
            );
            
            alert('🎉 Successfully registered for the event!');
            closeModal();
        } catch (err) {
            if (err.response?.status === 409) {
                alert('You are already registered for this event.');
            } else {
                alert(err.response?.data?.message || 'Failed to register for event');
            }
        } finally {
            setRegistering(false);
        }
    };

    const openModal = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const getColor = (category) => categoryColors[category] || categoryColors.default;

    const spotsLeft = (event) => {
        if (!event.capacity || !event.registered) return 0;
        return event.capacity - event.registered;
    };

    return (
        <div className="events-page">
            {/* Top Bar — same glass style as dashboard */}
            <header className="events-topbar">
                <div className="topbar-title">
                    <h1>Student Dashboard</h1>
                </div>
                <div className="topbar-user">
                    <span className="user-avatar-sm">{user?.name?.[0] || user?.email?.[0] || 'S'}</span>
                    <span>{user?.name || user?.email || 'Student'}</span>
                </div>
            </header>

            {/* Nav Tabs — same as dashboard */}
            <nav className="dashboard-nav-tabs">
                <button className="nav-tab" onClick={() => navigate('/student')}>
                    🏠 Dashboard
                </button>
                <button className="nav-tab active">
                    📅 All Events
                </button>
            </nav>

            {/* Search & Filter */}
            <section className="events-controls">
                <div className="search-wrapper">
                    <span className="search-icon-ev">🔍</span>
                    <input
                        type="text"
                        className="events-search"
                        placeholder="Search events by title, location, speaker…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
                    )}
                </div>

                <div className="category-tabs">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`cat-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={selectedCategory === cat.id ? { '--cat-color': getColor(cat.id) } : {}}
                        >
                            <span>{cat.emoji}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Results Summary */}
            <div className="results-bar">
                <span className="results-count">
                    {loading ? 'Loading…' : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} found`}
                </span>
            </div>

            {/* Events Grid */}
            <main className="events-grid-container">
                {loading ? (
                    <div className="events-loading">
                        <div className="spinner"></div>
                        <p>Loading events…</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="events-empty">
                        <span className="empty-icon">🔭</span>
                        <h3>No events found</h3>
                        <p>Try adjusting your search or category filter.</p>
                        <button
                            className="reset-btn"
                            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="events-grid">
                        {filteredEvents.map(event => (
                            <div key={event._id} className="event-card" onClick={() => openModal(event)}>
                                <div
                                    className="event-card-img"
                                    style={{ backgroundImage: `url(${event.image})` }}
                                >
                                    <span
                                        className="event-badge"
                                        style={{ background: getColor(event.category) }}
                                    >
                                        {CATEGORIES.find(c => c.id === event.category)?.emoji}{' '}
                                        {CATEGORIES.find(c => c.id === event.category)?.name || event.category}
                                    </span>
                                    {registeredEvents.includes(event._id) && (
                                        <span className="registered-badge">✔ Registered</span>
                                    )}
                                </div>

                                <div className="event-card-body">
                                    <h3 className="event-card-title">{event.title}</h3>
                                    <p className="event-card-desc">
                                        {event.description?.length > 90
                                            ? event.description.substring(0, 90) + '…'
                                            : event.description}
                                    </p>

                                    <div className="event-card-meta">
                                        <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span>📍 {event.location}</span>
                                        <span>🎤 {event.speaker || 'TBD'}</span>
                                    </div>

                                    <div className="event-card-footer">
                                        <div className="event-price-ticket">
                                            <span className="price-tag">{event.price || 'Free'}</span>
                                            <span className="spots-left">
                                                {spotsLeft(event) > 0 ? `${spotsLeft(event)} spots left` : 'Full'}
                                            </span>
                                        </div>
                                        <button
                                            className={`register-btn ${registeredEvents.includes(event._id) ? 'registered' : ''}`}
                                            onClick={e => { e.stopPropagation(); openModal(event); }}
                                            disabled={spotsLeft(event) === 0}
                                        >
                                            {registeredEvents.includes(event._id)
                                                ? '✔ Registered'
                                                : spotsLeft(event) === 0
                                                    ? 'Full'
                                                    : 'Register'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Event Detail Modal */}
            {showModal && selectedEvent && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="ev-modal" onClick={e => e.stopPropagation()}>
                        <button className="ev-modal-close" onClick={closeModal}>✕</button>

                        <div
                            className="ev-modal-img"
                            style={{ backgroundImage: `url(${selectedEvent.image})` }}
                        >
                            <span
                                className="event-badge large"
                                style={{ background: getColor(selectedEvent.category) }}
                            >
                                {CATEGORIES.find(c => c.id === selectedEvent.category)?.emoji}{' '}
                                {CATEGORIES.find(c => c.id === selectedEvent.category)?.name}
                            </span>
                        </div>

                        <div className="ev-modal-body">
                            <h2>{selectedEvent.title}</h2>
                            <p className="ev-modal-desc">{selectedEvent.description}</p>

                            <div className="ev-modal-details">
                                <div className="detail-row"><span>📅</span><span>{new Date(selectedEvent.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                                <div className="detail-row"><span>⏰</span><span>{selectedEvent.time || '10:00 AM – 06:00 PM'}</span></div>
                                <div className="detail-row"><span>📍</span><span>{selectedEvent.location}</span></div>
                                <div className="detail-row"><span>🎤</span><span>{selectedEvent.speaker || 'TBD'}</span></div>
                                <div className="detail-row"><span>💰</span><span>{selectedEvent.price || 'Free'}</span></div>
                                <div className="detail-row">
                                    <span>👥</span>
                                    <span>{selectedEvent.registered || 0}/{selectedEvent.capacity || 100} registered &middot; {spotsLeft(selectedEvent)} spots left</span>
                                </div>
                            </div>

                            <div className="ev-modal-capacity">
                                <div className="capacity-bar-bg">
                                    <div
                                        className="capacity-bar-fill"
                                        style={{
                                            width: `${Math.min(((selectedEvent.registered || 0) / (selectedEvent.capacity || 100)) * 100, 100)}%`,
                                            background: getColor(selectedEvent.category),
                                        }}
                                    />
                                </div>
                                <small>{Math.round(((selectedEvent.registered || 0) / (selectedEvent.capacity || 100)) * 100)}% filled</small>
                            </div>

                            <div className="ev-modal-actions">
                                {registeredEvents.includes(selectedEvent._id) ? (
                                    <button className="register-btn registered large" disabled>✔ Already Registered</button>
                                ) : spotsLeft(selectedEvent) === 0 ? (
                                    <button className="register-btn full large" disabled>Event Full</button>
                                ) : (
                                    <button
                                        className="register-btn large"
                                        onClick={() => handleRegister(selectedEvent._id)}
                                        disabled={registering}
                                    >
                                        {registering ? 'Registering...' : 'Confirm Registration'}
                                    </button>
                                )}
                                <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}