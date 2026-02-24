const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  getAdminRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');

// Student routes
router.post('/register-event', auth, registerForEvent);
router.get('/my-registrations', auth, getMyRegistrations);
router.delete('/cancel/:registrationId', auth, cancelRegistration);

// Admin routes
router.get('/event/:eventId', auth, requireRole('admin'), getEventRegistrations);
router.get('/admin/all', auth, requireRole('admin'), getAdminRegistrations);

module.exports = router;
