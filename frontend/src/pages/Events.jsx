import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EventRegistrationForm from '../components/EventRegistrationForm';
import './Events.css';

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
    const { user, token } = useContext(AuthContext);

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [registering, setRegistering] = useState(false);

    // Load events from API
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/events/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Transform API data to match component format
                    const transformedEvents = data.map(event => ({
                        ...event,
                        _id: event._id,
                        image: event.image ?
                            (event.image.startsWith('http') ? event.image : `http://localhost:5000/uploads/${event.image}`) :
                            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
                        date: event.eventDate,
                        category: event.category || 'tech',
                        speaker: event.admin?.name || 'Admin',
                        capacity: event.capacity || 100,
                        registered: event.registered || 0,
                        price: event.ticketPrice ? `$${event.ticketPrice}` : 'Free',
                        time: new Date(event.eventDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) + ' onwards'
                    }));
                    setEvents(transformedEvents);
                } else {
                    console.error('Failed to fetch events');
                }
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchEvents();
        }
    }, [token]);

    // Load user's registered events
    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:5000/api/registrations/my-registrations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Filter out registrations where event was deleted (event is null)
                    const registeredEventIds = data
                        .filter(reg => reg.event && reg.event._id)
                        .map(reg => reg.event._id);
                    setRegisteredEvents(registeredEventIds);
                }
            } catch (err) {
                console.error('Error fetching registrations:', err);
            }
        };

        fetchRegistrations();
    }, [token]);

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

    const handleRegister = (eventId) => {
        const event = events.find(e => e._id === eventId);
        setSelectedEvent(event);
        setShowRegistrationForm(true);
        setShowModal(false);
    };

    const handleRegistrationSuccess = () => {
        if (selectedEvent) {
            setRegisteredEvents(prev => [...prev, selectedEvent._id]);
        }
        setShowRegistrationForm(false);
    };

    const openModal = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const closeRegistrationForm = () => {
        setShowRegistrationForm(false);
        setSelectedEvent(null);
    };

    const getColor = (category) => categoryColors[category] || categoryColors.default;

    const spotsLeft = (event) => Math.max(0, event.capacity - event.registered);

    return (
        <div className="events-page">
            {/* Registration Form Modal */}
            {showRegistrationForm && selectedEvent && (
                <EventRegistrationForm
                    event={selectedEvent}
                    onClose={closeRegistrationForm}
                    onSuccess={handleRegistrationSuccess}
                />
            )}

            {/* Top Bar — same glass style as dashboard */}
            <header className="events-topbar">
                <div className="topbar-title">
                    <h1>All Events</h1>
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
                                        <span>📅 {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span>📍 {event.location}</span>
                                        <span>🎤 {event.speaker || 'TBD'}</span>
                                    </div>

                                    <div className="event-card-footer">
                                        <div className="event-price-ticket">
                                            <span className="price-tag">{event.price}</span>
                                            {spotsLeft(event) > 0 && (
                                                <span className="spots-left">
                                                    {`${spotsLeft(event)} spots left`}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            className={`register-btn ${registeredEvents.includes(event._id) ? 'registered' : ''}`}
                                            onClick={e => { e.stopPropagation(); handleRegister(event._id); }}
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
                                <div className="detail-row"><span>📅</span><span>{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                                <div className="detail-row"><span>⏰</span><span>{selectedEvent.time}</span></div>
                                <div className="detail-row"><span>📍</span><span>{selectedEvent.location}</span></div>
                                <div className="detail-row"><span>🎤</span><span>Organized by: {selectedEvent.speaker}</span></div>
                                <div className="detail-row"><span>💰</span><span>{selectedEvent.price}</span></div>
                                <div className="detail-row">
                                    <span>👥</span>
                                    <span>{selectedEvent.registered}/{selectedEvent.capacity} registered</span>
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
                                        Register for Event
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

