import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState('email');

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const otpRefs = useRef([]);

    // Countdown for resend
    useEffect(() => {
        if (resendTimer <= 0) return;
        const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
        return () => clearInterval(id);
    }, [resendTimer]);

    //Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Please enter your email.'); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/forgot-password/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.msg || 'Failed to send OTP'); return; }
            setStep('otp');
            setResendTimer(60);
        } catch {
            setError('Network error. Make sure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    //OTP input handling
    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const updated = [...otp];
        pasted.split('').forEach((ch, i) => { updated[i] = ch; });
        setOtp(updated);
        const nextEmpty = pasted.length < 6 ? pasted.length : 5;
        otpRefs.current[nextEmpty]?.focus();
    };

    //Verify OTP 
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        const otpValue = otp.join('');
        if (otpValue.length < 6) { setError('Please enter all 6 digits.'); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/forgot-password/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: otpValue }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.msg || 'OTP verification failed'); return; }
            setStep('reset');
        } catch {
            setError('Network error. Make sure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    //Resend OTP
    const handleResend = async () => {
        if (resendTimer > 0) return;
        setError('');
        setOtp(['', '', '', '', '', '']);
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/forgot-password/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.msg || 'Failed to resend OTP'); return; }
            setResendTimer(60);
        } catch {
            setError('Network error.');
        } finally {
            setLoading(false);
        }
    };

    //Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/forgot-password/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: otp.join(''), newPassword }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.msg || 'Password reset failed'); return; }
            setStep('success');
        } catch {
            setError('Network error. Make sure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    //Step indicators
    const steps = ['email', 'otp', 'reset'];
    const stepIndex = steps.indexOf(step);

    return (
        <div className="fp-container">
            {/* Left branding panel */}
            <div className="fp-brand">
                <div className="fp-brand-glow" />
                <div className="fp-brand-content">
                    <div className="fp-logo">
                        <span className="fp-logo-emoji">🎓</span>
                        <span className="fp-logo-text">Campus<span className="fp-logo-accent">Event</span>Hub</span>
                    </div>

                    <h1 className="fp-brand-title">
                        Account<br />
                        <span className="fp-brand-highlight">Recovery</span>
                    </h1>

                    <p className="fp-brand-desc">
                        Don't worry — it happens to the best of us. Enter your email, verify with OTP, and you'll be back in no time.
                    </p>

                    <div className="fp-steps-visual">
                        <div className="fp-step-item">
                            <div className={`fp-step-dot ${stepIndex >= 0 ? 'active' : ''} ${stepIndex > 0 ? 'done' : ''}`}>
                                {stepIndex > 0 ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : '1'}
                            </div>
                            <span>Enter Email</span>
                        </div>
                        <div className={`fp-step-connector ${stepIndex > 0 ? 'done' : ''}`} />
                        <div className="fp-step-item">
                            <div className={`fp-step-dot ${stepIndex >= 1 ? 'active' : ''} ${stepIndex > 1 ? 'done' : ''}`}>
                                {stepIndex > 1 ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : '2'}
                            </div>
                            <span>Verify OTP</span>
                        </div>
                        <div className={`fp-step-connector ${stepIndex > 1 ? 'done' : ''}`} />
                        <div className="fp-step-item">
                            <div className={`fp-step-dot ${stepIndex >= 2 ? 'active' : ''}`}>3</div>
                            <span>New Password</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="fp-form-section">
                <div className="fp-form-card">

                    {/*Back to login link */}
                    <button className="fp-back-btn" onClick={() => navigate('/login')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Login
                    </button>

                    {/* Email Entr */}
                    {step === 'email' && (
                        <div className="fp-step-content fp-anim-in">
                            <div className="fp-step-icon email-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 6L12 13L2 6" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="fp-title">Forgot Password?</h2>
                            <p className="fp-subtitle">Enter the email address linked to your account and we'll send you a one-time passcode.</p>

                            <form onSubmit={handleSendOtp} className="fp-form">
                                <div className="fp-form-group">
                                    <label htmlFor="fp-email">Email Address</label>
                                    <input
                                        id="fp-email"
                                        type="email"
                                        placeholder="your@college.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                {error && <p className="fp-error">{error}</p>}

                                <button type="submit" className="fp-primary-btn" disabled={loading}>
                                    {loading ? <span className="fp-spinner" /> : 'Send OTP'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* OTP Verification*/}
                    {step === 'otp' && (
                        <div className="fp-step-content fp-anim-in">
                            <div className="fp-step-icon otp-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7C3AED" strokeWidth="2" />
                                    <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1.5" fill="#7C3AED" />
                                </svg>
                            </div>
                            <h2 className="fp-title">Enter OTP</h2>
                            <p className="fp-subtitle">
                                We sent a 6-digit code to<br />
                                <strong className="fp-email-display">{email}</strong>
                            </p>

                            <form onSubmit={handleVerifyOtp} className="fp-form">
                                <div className="fp-otp-row" onPaste={handleOtpPaste}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            ref={(el) => (otpRefs.current[i] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            className={`fp-otp-input ${digit ? 'filled' : ''}`}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            autoFocus={i === 0}
                                        />
                                    ))}
                                </div>

                                {error && <p className="fp-error">{error}</p>}

                                <button type="submit" className="fp-primary-btn" disabled={loading}>
                                    {loading ? <span className="fp-spinner" /> : 'Verify OTP'}
                                </button>

                                <div className="fp-resend-row">
                                    <span className="fp-resend-text">Didn't receive it?</span>
                                    <button
                                        type="button"
                                        className={`fp-resend-btn ${resendTimer > 0 ? 'disabled' : ''}`}
                                        onClick={handleResend}
                                        disabled={resendTimer > 0 || loading}
                                    >
                                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="fp-change-email-btn"
                                    onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']); setError(''); }}
                                >
                                    Change email address
                                </button>
                            </form>
                        </div>
                    )}

                    {/* New Password*/}
                    {step === 'reset' && (
                        <div className="fp-step-content fp-anim-in">
                            <div className="fp-step-icon reset-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#7C3AED" strokeWidth="2" />
                                    <path d="M9 12L11 14L15 10" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="fp-title">Create New Password</h2>
                            <p className="fp-subtitle">Your identity has been verified. Set a new strong password for your account.</p>

                            <form onSubmit={handleResetPassword} className="fp-form">
                                <div className="fp-form-group">
                                    <label htmlFor="fp-new-pass">New Password</label>
                                    <div className="fp-pass-wrap">
                                        <input
                                            id="fp-new-pass"
                                            type={showNewPass ? 'text' : 'password'}
                                            placeholder="Minimum 6 characters"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                        <button type="button" className="fp-eye-btn" onClick={() => setShowNewPass(!showNewPass)}>
                                            {showNewPass
                                                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20C7 20 2.73 16.89 1 12a10.09 10.09 0 012.26-3.67M6.53 6.53A10 10 0 0112 4c5 0 9.27 3.11 11 8a10.14 10.14 0 01-4.69 5.62M1 1L23 23" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="#94A3B8" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="#94A3B8" strokeWidth="2" /></svg>
                                            }
                                        </button>
                                    </div>
                                    {/* Password strength bar */}
                                    {newPassword.length > 0 && (
                                        <div className="fp-strength-bar">
                                            <div
                                                className={`fp-strength-fill strength-${newPassword.length < 6 ? 'weak'
                                                    : newPassword.length < 10 ? 'medium'
                                                        : 'strong'
                                                    }`}
                                                style={{ width: `${Math.min((newPassword.length / 12) * 100, 100)}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="fp-form-group">
                                    <label htmlFor="fp-confirm-pass">Confirm Password</label>
                                    <div className="fp-pass-wrap">
                                        <input
                                            id="fp-confirm-pass"
                                            type={showConfirmPass ? 'text' : 'password'}
                                            placeholder="Re-enter your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button type="button" className="fp-eye-btn" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                            {showConfirmPass
                                                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20C7 20 2.73 16.89 1 12a10.09 10.09 0 012.26-3.67M6.53 6.53A10 10 0 0112 4c5 0 9.27 3.11 11 8a10.14 10.14 0 01-4.69 5.62M1 1L23 23" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="#94A3B8" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="#94A3B8" strokeWidth="2" /></svg>
                                            }
                                        </button>
                                    </div>
                                    {confirmPassword && newPassword && confirmPassword !== newPassword && (
                                        <span className="fp-mismatch">Passwords do not match</span>
                                    )}
                                    {confirmPassword && newPassword && confirmPassword === newPassword && (
                                        <span className="fp-match">✓ Passwords match</span>
                                    )}
                                </div>

                                {error && <p className="fp-error">{error}</p>}

                                <button type="submit" className="fp-primary-btn" disabled={loading}>
                                    {loading ? <span className="fp-spinner" /> : 'Reset Password'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/*SUCCESS*/}
                    {step === 'success' && (
                        <div className="fp-step-content fp-success-content fp-anim-in">
                            <div className="fp-success-ring">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6L9 17L4 12" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="fp-title">Password Reset!</h2>
                            <p className="fp-subtitle">Your password has been changed successfully. You can now sign in with your new password.</p>
                            <button className="fp-primary-btn" onClick={() => navigate('/login')}>
                                Go to Sign In
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
