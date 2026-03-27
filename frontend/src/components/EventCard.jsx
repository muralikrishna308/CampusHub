import React from "react";
import { FiShare2 } from 'react-icons/fi';

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#a855f7"/></linearGradient></defs><rect fill="url(#g)" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="48">📅</text></svg>');

const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';

const EventCard = ({ title, category, location, joined, image, onClick, footer }) => {
    const imageUrl = image
        ? (image.startsWith('http') ? image : `${API_URL}/uploads/${encodeURIComponent(image)}`)
        : FALLBACK_IMG;

    const handleShare = async (e) => {
        e.stopPropagation();
        const shareData = {
            title: title,
            text: `Check out this event: ${title} on CampusHub!`,
            url: window.location.origin + '/events' // Fallback to events page for now
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('Event link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="card" style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
            <div
                className="card-img"
                style={{ backgroundImage: `url(${imageUrl})`, position: 'relative' }}
            >
                <button 
                    onClick={handleShare}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(15, 15, 26, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.2s ease',
                        zIndex: 2
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.8)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(15, 15, 26, 0.6)'}
                    title="Share Event"
                >
                    <FiShare2 size={16} />
                </button>
            </div>
            <div className="card-content">
                <span className="card-tag">{category}</span>
                <h3 className="card-title">{title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6F767E', fontSize: '14px', marginBottom: '16px' }}>
                    <span>📍 {location}</span>
                </div>
                
                {footer ? footer : (
                    <div className="card-footer">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ display: 'flex' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        border: '2px solid white',
                                        background: '#DDD',
                                        marginLeft: i > 1 ? '-8px' : '0'
                                    }}></div>
                                ))}
                            </div>
                            <span style={{ fontSize: '12px', color: '#6F767E' }}>+{joined} joined</span>
                        </div>
                        <button className="btn-primary" onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}>Join Now</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
