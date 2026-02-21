import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Events.css';

const eventImages = {
    tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    music: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600',
    workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
    cultural: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
    default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
};

const MOCK_EVENTS = [
    {
        _id: 1,
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring latest trends in AI, Web Development, and Cloud Computing. Join industry leaders and innovators for a day of knowledge sharing.',
        date: '2024-03-15',
        time: '09:00 AM – 06:00 PM',
        location: 'Convention Center, Hall A',
        category: 'tech',
        image: eventImages.tech,
        speaker: 'Dr. Sarah Johnson',
        capacity: 500,
        registered: 342,
        price: 'Free',
    },
    {
        _id: 2,
        title: 'Summer Music Festival',
        description: 'A day filled with amazing performances from top artists across genres. Experience live music like never before under the open sky.',
        date: '2024-03-20',
        time: '12:00 PM – 11:00 PM',
        location: 'Central Park, Main Stage',
        category: 'music',
        image: eventImages.music,
        speaker: 'Various Artists',
        capacity: 2000,
        registered: 1450,
        price: '$25',
    },
    {
        _id: 3,
        title: 'React Advanced Workshop',
        description: 'Deep dive into React hooks, context API, and performance optimization techniques. Hands-on coding sessions included.',
        date: '2024-03-25',
        time: '10:00 AM – 04:00 PM',
        location: 'Online (Zoom)',
        category: 'workshop',
        image: eventImages.workshop,
        speaker: 'Mike Chen',
        capacity: 100,
        registered: 78,
        price: '$50',
    },
    {
        _id: 4,
        title: 'Cultural Night 2024',
        description: 'Celebrate diversity with music, dance, and food from around the world. An evening of unity and cultural exchange.',
        date: '2024-04-05',
        time: '06:00 PM – 10:00 PM',
        location: 'City Auditorium',
        category: 'cultural',
        image: eventImages.cultural,
        speaker: 'Cultural Society',
        capacity: 800,
        registered: 320,
        price: '$15',
    },
    {
        _id: 5,
        title: 'Basketball Tournament',
        description: 'Annual inter-college basketball tournament. Form your team and compete for the championship trophy.',
        date: '2024-04-10',
        time: '08:00 AM – 06:00 PM',
        location: 'Sports Complex',
        category: 'sports',
        image: eventImages.sports,
        speaker: 'Sports Department',
        capacity: 16,
        registered: 12,
        price: '$100 per team',
    },
    {
        _id: 6,
        title: 'Startup Pitch Competition',
        description: 'Showcase your startup idea to seasoned investors and get a chance to win seed funding. Network with entrepreneurs and VCs.',
        date: '2024-03-18',
        time: '02:00 PM – 06:00 PM',
        location: 'Innovation Hub',
        category: 'tech',
        image: eventImages.tech,
        speaker: 'Venture Capitalists',
        capacity: 50,
        registered: 35,
        price: 'Free',
    },
    {
        _id: 7,
        title: 'Photography Masterclass',
        description: 'Learn the art of photography from award-winning photographers. Topics include composition, lighting, and post-processing.',
        date: '2024-04-15',
        time: '10:00 AM – 02:00 PM',
        location: 'Art Studio, Block B',
        category: 'workshop',
        image: eventImages.workshop,
        speaker: 'Emma Rodriguez',
        capacity: 30,
        registered: 22,
        price: '$30',
    },
    {
        _id: 8,
        title: 'Folk Dance Evening',
        description: 'A vibrant showcase of traditional folk dances from various states. Performances by award-winning dance troupes.',
        date: '2024-04-20',
        time: '05:00 PM – 08:00 PM',
        location: 'Open Air Theatre',
        category: 'cultural',
        image: eventImages.cultural,
        speaker: 'Dance Academy',
        capacity: 1000,
        registered: 650,
        price: 'Free',
    },
];

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

    // Load events
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setEvents(MOCK_EVENTS);
            setFilteredEvents(MOCK_EVENTS);
            setLoading(false);
        }, 600);
    }, []);

    // Filter events
    useEffect(() => {
        let result = events;
        if (selectedCategory !== 'all') {
            result = result.filter(e => e.category === selectedCategory);
        }
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                e =>
                    e.title.toLowerCase().includes(term) ||
                    e.description.toLowerCase().includes(term) ||
                    e.location.toLowerCase().includes(term) ||
                    e.speaker.toLowerCase().includes(term)
            );
        }
        setFilteredEvents(result);
    }, [searchTerm, selectedCategory, events]);

    const handleRegister = (eventId) => {
        if (!registeredEvents.includes(eventId)) {
            setRegisteredEvents(prev => [...prev, eventId]);
            alert('🎉 Successfully registered for the event!');
        } else {
            alert('You are already registered for this event.');
        }
        setShowModal(false);
        setSelectedEvent(null);
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

    const spotsLeft = (event) => event.capacity - event.registered;

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
                                        {event.description.length > 90
                                            ? event.description.substring(0, 90) + '…'
                                            : event.description}
                                    </p>

                                    <div className="event-card-meta">
                                        <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span>📍 {event.location}</span>
                                        <span>🎤 {event.speaker}</span>
                                    </div>

                                    <div className="event-card-footer">
                                        <div className="event-price-ticket">
                                            <span className="price-tag">{event.price}</span>
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
                                <div className="detail-row"><span>⏰</span><span>{selectedEvent.time}</span></div>
                                <div className="detail-row"><span>📍</span><span>{selectedEvent.location}</span></div>
                                <div className="detail-row"><span>🎤</span><span>{selectedEvent.speaker}</span></div>
                                <div className="detail-row"><span>💰</span><span>{selectedEvent.price}</span></div>
                                <div className="detail-row">
                                    <span>👥</span>
                                    <span>{selectedEvent.registered}/{selectedEvent.capacity} registered &middot; {spotsLeft(selectedEvent)} spots left</span>
                                </div>
                            </div>

                            <div className="ev-modal-capacity">
                                <div className="capacity-bar-bg">
                                    <div
                                        className="capacity-bar-fill"
                                        style={{
                                            width: `${Math.min((selectedEvent.registered / selectedEvent.capacity) * 100, 100)}%`,
                                            background: getColor(selectedEvent.category),
                                        }}
                                    />
                                </div>
                                <small>{Math.round((selectedEvent.registered / selectedEvent.capacity) * 100)}% filled</small>
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
                                    >
                                        Confirm Registration
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