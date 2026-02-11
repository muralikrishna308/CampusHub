export default function StatCard({ label, value, trend, icon }) {
    return (
        <div className="stat-card">
            <div className="stat-header">
                <div className="stat-icon">{icon}</div>
                <div className="stat-trend" style={{ color: trend.startsWith('+') ? '#27AE60' : trend === 'Stable' ? '#6F767E' : '#EB5757' }}>
                    {trend}
                </div>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}
