import React from "react";

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#a855f7"/></linearGradient></defs><rect fill="url(#g)" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="48">📅</text></svg>');

const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';

const EventCard = ({ title, category, location, joined, image }) => {
    const imageUrl = image
        ? (image.startsWith('http') ? image : `${API_URL}/uploads/${encodeURIComponent(image)}`)
        : FALLBACK_IMG;

    return (
        <div className="card">
            <div
                className="card-img"
                style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <div className="card-content">
                <span className="card-tag">{category}</span>
                <h3 className="card-title">{title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6F767E', fontSize: '14px', marginBottom: '16px' }}>
                    <span>📍 {location}</span>
                </div>
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
                    <button className="btn-primary">Join Now</button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
