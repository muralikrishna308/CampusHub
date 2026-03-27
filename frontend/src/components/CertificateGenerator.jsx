import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const CertificateGenerator = ({ studentName, eventTitle, eventDate, onClose }) => {
    const downloadCertificate = async () => {
        const input = document.getElementById('certificate-template');
        try {
            const canvas = await html2canvas(input, {
                scale: 2, // Higher quality
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${studentName}_${eventTitle}_Certificate.pdf`);
            onClose();
        } catch (err) {
            console.error('Error generating certificate:', err);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 10000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)'
        }}>
            <div id="certificate-template" style={{
                width: '842px', height: '595px',
                background: '#ffffff', padding: '60px',
                position: 'relative', overflow: 'hidden',
                color: '#1e293b', fontFamily: "'Inter', sans-serif",
                border: '1px solid #e2e8f0'
            }}>
                {/* Elegant Double Gold Border */}
                <div style={{
                    position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px',
                    border: '2px solid #d4af37', zIndex: 1
                }}></div>
                <div style={{
                    position: 'absolute', top: '30px', left: '30px', right: '30px', bottom: '30px',
                    border: '1px solid #d4af37', zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    
                    {/* Header Logo/Text */}
                    <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '5px', color: '#64748b', textTransform: 'uppercase', marginBottom: '30px' }}>
                        Campus Hub Platform
                    </div>
                    
                    {/* Main Title */}
                    <h1 style={{ 
                        fontSize: '52px', 
                        fontWeight: '400', 
                        margin: '0 0 10px 0', 
                        color: '#1e293b', 
                        fontFamily: 'serif',
                        letterSpacing: '2px'
                    }}>
                        Certificate of Achievement
                    </h1>
                    
                    {/* Subtitle */}
                    <div style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', letterSpacing: '1px' }}>
                        This is to certify that
                    </div>

                    {/* Student Name */}
                    <div style={{ 
                        fontSize: '44px', 
                        fontWeight: '800', 
                        color: '#d4af37', 
                        marginBottom: '15px', 
                        fontFamily: 'serif',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '10px',
                        minWidth: '400px'
                    }}>
                        {studentName}
                    </div>

                    {/* Context Text */}
                    <div style={{ fontSize: '17px', color: '#475569', lineHeight: 1.8, maxWidth: '650px', margin: '30px auto' }}>
                        has successfully completed and attended the university event
                        <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '24px', marginTop: '10px' }}>
                            {eventTitle}
                        </div>
                    </div>

                    {/* Bottom Section: Signatures & Date */}
                    <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '650px' }}>
                        <div style={{ textAlign: 'center', width: '200px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', paddingBottom: '5px' }}>
                                {new Date(eventDate).toLocaleDateString()}
                            </div>
                            <div style={{ borderTop: '1px solid #cbd5e1', width: '100%', margin: '0 auto 8px auto' }}></div>
                            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Date Issued</div>
                        </div>

                        {/* Centered Seal */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                width: '80px', height: '80px',
                                borderRadius: '50%',
                                border: '2px solid #d4af37',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '65px', height: '65px',
                                    borderRadius: '50%',
                                    background: '#d4af37',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '9px', fontWeight: '900', color: '#fff',
                                    textAlign: 'center', textTransform: 'uppercase'
                                }}>
                                    Official<br/>Seal
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', width: '200px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', paddingBottom: '5px' }}>
                                CampusHub Admin
                            </div>
                            <div style={{ borderTop: '1px solid #cbd5e1', width: '100%', margin: '0 auto 8px auto' }}></div>
                            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Authorized Signatory</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
                <button 
                    onClick={onClose}
                    style={{
                        padding: '12px 32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: '600', cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
                <button 
                    onClick={downloadCertificate}
                    style={{
                        padding: '12px 32px', borderRadius: '12px', border: 'none',
                        background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)'
                    }}
                >
                    🚀 Download PDF
                </button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '16px', fontSize: '13px' }}>
                Preparing your achievement record...
            </p>
        </div>
    );
};

export default CertificateGenerator;
