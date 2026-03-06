import React from "react";

const EventCard = ({ title, category, location, joined, image }) => {
    const imageUrl = image ?
        (image.startsWith('http') ? image : `http://localhost:5000/uploads/${image}`) :
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80';

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
