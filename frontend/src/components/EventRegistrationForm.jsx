import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './EventRegistrationForm.css';

const EventRegistrationForm = ({ event, onClose, onSuccess }) => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    department: '',
    year: '',
    college: user?.college || '',
    city: '',
    gender: ''
  });

  // Fetch user profile data to pre-fill form
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          const nameParts = (userData.name || '').split(' ');
          
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: userData.email || user?.email || '',
            phone: userData.phone || '',
            department: userData.department || '',
            year: userData.year || '',
            college: userData.college || user?.college || '',
            city: userData.city || '',
            gender: userData.gender || ''
          }));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/registrations/register-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: event._id,
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || data.error || 'Failed to register for event');
        setSubmitting(false);
        return;
      }

      setSuccess('✅ Successfully registered for the event!');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        if (onClose) {
          onClose();
        }
      }, 1500);
    } catch (err) {
      setError('Error registering for event: ' + err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="reg-form-overlay">
        <div className="reg-form-modal">
          <div className="loading-spinner">Loading your profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-form-overlay">
      <div className="reg-form-modal">
        <div className="reg-form-header">
          <div className="event-info">
            <h3>{event?.title}</h3>
            <p className="event-date">
              📅 {new Date(event?.eventDate).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="reg-form">
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="form-section-title">Personal Information</div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="form-section-title">Academic Information</div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="form-group">
              <label>Year</label>
              <select name="year" value={formData.year} onChange={handleChange}>
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>College</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter college name"
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-register" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register for Event'}
            </button>
            <button type="button" className="btn-cancel-reg" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationForm;
