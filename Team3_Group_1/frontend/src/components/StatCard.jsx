import React from "react";

const StatCard = ({ label, value, trend, icon }) => {
    const isTrendingUp = trend?.startsWith("+");
    const isStable = trend === "Stable";

    return (
        <div className="stat-card">
            <div className="stat-header">
                <div className="stat-icon">{icon}</div>
                {!isStable && (
                    <div className={`stat-trend ${isTrendingUp ? 'up' : 'down'}`}>
                        {trend}
                    </div>
                )}
                {isStable && <div className="stat-trend stable">{trend}</div>}
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

export default StatCard;
