const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { getAdminStats, getUserDashboard } = require('../controllers/adminController');

// Accessible to any authenticated user: user dashboard data
router.get('/user', auth, getUserDashboard);

// Accessible only to admins: aggregated stats
router.get('/admin', auth, requireRole('admin'), getAdminStats);

module.exports = router;
