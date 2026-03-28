import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CertificateGenerator from '../components/CertificateGenerator';
import './MyRegistrations.css'; // Reusing styles for consistency

const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';

const CertificatesPage = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeCertificate, setActiveCertificate] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);

    const toggleSidebar = useCallback(() => setSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!token) return;
            try {
                // Fetch profile for name
                const profileRes = await fetch(`${API_URL}/api/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setStudentProfile(profileData);
                }

                setLoading(true);
                const response = await fetch(`${API_URL}/api/registrations/my-registrations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    // Filter for attended events only
                    const attendedOnly = data.filter(reg => reg.status === 'attended' && reg.event);
                    setCertificates(attendedOnly);
                }
            } catch (err) {
                console.error('Error fetching certificates:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [token]);

    return (
        <div className="dashboard-container">
            <Sidebar role="student" isOpen={sidebarOpen} onClose={closeSidebar} />

            <main className="main-content">
                <Header
                    userName={studentProfile?.name || user?.name || "Student"}
                    userRole="Student"
                    id={user?.id}
                    onToggle={toggleSidebar}
                />

                <div className="myreg-content-wrapper">
                    <div className="myreg-page-title">
                        <div>
                            <h1>🏅 My Certifications</h1>
                            <p>View and download your official participation records</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="myreg-loading">
                            <div className="spinner"></div>
                            <p>Loading your achievements...</p>
                        </div>
                    ) : certificates.length === 0 ? (
                        <div className="myreg-empty">
                            <div className="myreg-empty__icon">🏅</div>
                            <h3>No certificates yet</h3>
                            <p>
                                Attend events and get marked as "Attended" by organizers to earn your certificates!
                            </p>
                            <button
                                className="myreg-empty__btn"
                                onClick={() => navigate('/events')}
                            >
                                🔍 Explore Events
                            </button>
                        </div>
                    ) : (
                        <div className="myreg-grid">
                            {certificates.map((cert) => (
                                <div key={cert._id} className="myreg-card" style={{ border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                                    <div className="myreg-card__img">
                                        <div
                                            className="myreg-card__img-inner"
                                            style={{
                                                backgroundImage: `url(${cert.event.image.startsWith('http') ? cert.event.image : `${API_URL}/uploads/${cert.event.image}`})`,
                                                filter: 'grayscale(0.3) contrast(1.1)'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '50px',
                                            fontSize: '10px',
                                            fontWeight: '800',
                                            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
                                        }}>
                                            CERTIFIED 🏅
                                        </div>
                                    </div>

                                    <div className="myreg-card__body">
                                        <h3 className="myreg-card__title">{cert.event.title}</h3>
                                        <p className="myreg-card__desc" style={{ fontSize: '12px' }}>
                                            Completion Date: {new Date(cert.event.eventDate).toLocaleDateString()}
                                        </p>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                                            <button
                                                className="myreg-card__btn"
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(251, 191, 36, 0.4)',
                                                    color: '#fbbf24'
                                                }}
                                                onClick={() => setActiveCertificate({
                                                    studentName: studentProfile?.name || user?.name || "Student",
                                                    eventTitle: cert.event.title,
                                                    eventDate: cert.event.eventDate
                                                })}
                                            >
                                                View Certificate
                                            </button>
                                            <button
                                                className="myreg-card__btn"
                                                style={{
                                                    width: '100%',
                                                    background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                                                    color: 'white',
                                                    border: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    fontWeight: '700'
                                                }}
                                                onClick={() => setActiveCertificate({
                                                    studentName: studentProfile?.name || user?.name || "Student",
                                                    eventTitle: cert.event.title,
                                                    eventDate: cert.event.eventDate
                                                })}
                                            >
                                                📥 Download Certificate (PDF)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {activeCertificate && (
                    <CertificateGenerator
                        {...activeCertificate}
                        onClose={() => setActiveCertificate(null)}
                    />
                )}
            </main>
        </div>
    );
};

export default CertificatesPage;
