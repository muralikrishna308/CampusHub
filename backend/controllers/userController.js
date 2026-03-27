const User = require('../models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      phone,
      college,
      department,
      year,
      gender,
      address,
      city,
      state,
      zipcode,
      collegeName,
      bio,
      interests
    } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name: name || undefined,
        phone: phone || undefined,
        college: college || collegeName || undefined,
        department: department || undefined,
        year: year || undefined,
        gender: gender || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zipcode: zipcode || undefined,
        collegeName: college || collegeName || undefined,
        bio: bio || undefined,
        interests: interests || undefined,
        profileComplete: true,
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Check if profile is complete
exports.checkProfileComplete = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('profileComplete');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ profileComplete: user.profileComplete || false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
