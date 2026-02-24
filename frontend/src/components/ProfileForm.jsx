import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ProfileForm.css';

const ProfileForm = ({ onProfileComplete, onClose }) => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    department: user?.department || '',
    year: user?.year || '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    collegeName: user?.collegeName || ''
  });

  useEffect(() => {
    // Fetch existing profile data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        department: user.department || '',
        year: user.year || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipcode: user.zipcode || '',
        collegeName: user.collegeName || ''
      }));
    }
  }, [user]);

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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update profile');
        return;
      }

      setSuccess('Profile updated successfully! ✅');
      
      // Call the callback to notify parent component
      if (onProfileComplete) {
        setTimeout(() => {
          onProfileComplete();
        }, 1500);
      }
    } catch (err) {
      setError('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-form-overlay">
      <div className="profile-form-modal">
        <div className="profile-form-header">
          <h2>Complete Your Profile</h2>
          <p>Please fill in your details to complete registration</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
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
                placeholder="Enter your phone number"
              />
            </div>
          </div>

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
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>College Name</label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="Enter your college name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Zipcode</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              placeholder="Enter your zipcode"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
            {onClose && (
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
