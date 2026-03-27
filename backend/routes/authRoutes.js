const express = require('express');
const router = express.Router();
const { register, login, getMe, sendOTP, verifyOTP, resetPassword } = require('../controllers/authController');
const { updateProfile, getProfile, checkProfileComplete } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

// User Profile Routes
router.put('/profile/update', auth, updateProfile);
router.get('/profile', auth, getProfile);
router.get('/profile/check', auth, checkProfileComplete);

// Forgot Password Routes
router.post('/forgot-password/send-otp', sendOTP);
router.post('/forgot-password/verify-otp', verifyOTP);
router.post('/forgot-password/reset-password', resetPassword);

module.exports = router;
