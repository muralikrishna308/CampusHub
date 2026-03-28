const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const sendEmail = require("../utils/sendemail");
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  getAdminRegistrations,
  cancelRegistration,
  acceptRegistration,
  rejectRegistration,
  markAttended,
  submitFeedback,
  getRegistrationById
} = require('../controllers/registrationController');

// Student routes
router.post('/register-event', auth, registerForEvent);
router.get('/my-registrations', auth, getMyRegistrations);
router.delete('/cancel/:registrationId', auth, cancelRegistration);
router.post('/:registrationId/feedback', auth, submitFeedback);
router.get('/:registrationId', auth, getRegistrationById);

// Admin routes
router.get('/event/:eventId', auth, requireRole('admin'), getEventRegistrations);
router.get('/admin/all', auth, requireRole('admin'), getAdminRegistrations);
router.put("/accept/:registrationId", auth, requireRole("admin"), acceptRegistration);
router.put("/reject/:registrationId", auth, requireRole("admin"), rejectRegistration);
router.put("/attend/:registrationId", auth, requireRole("admin"), markAttended);
module.exports = router;
