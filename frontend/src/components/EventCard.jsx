export default function EventCard({ title, category, location, date, image, joined }) {
    return (
        <div className="card">
            <div
                className="card-img"
                style={{ backgroundImage: `url(${image || 'https://via.placeholder.com/400x200?text=Event'})` }}
            ></div>
            <div className="card-content">
                <span className="card-tag">{category}</span>
                <h3 className="card-title">{title}</h3>
                <p style={{ fontSize: "14px", marginBottom: "8px", textAlign: "left" }}>
                    📍 {location}
                </p>
                <div className="card-footer">
                    <div className="joined-info">
                        <span style={{ fontSize: "12px", color: "#6F767E" }}>+{joined} Joined</span>
                    </div>
                    <button className="btn-primary">Register</button>
                </div>
            </div>
        </div>
    );
}
