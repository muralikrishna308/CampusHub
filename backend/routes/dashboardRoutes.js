const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const upload = require('../middleware/upload');

const {
  getAdminStats,
  getUserDashboard,
  createEvent
} = require('../controllers/adminController');

const Event = require('../models/Event');


// ---------------- USER DASHBOARD ----------------
router.get('/user', auth, getUserDashboard);


// ---------------- ADMIN STATS ----------------
router.get('/admin', auth, requireRole('admin'), getAdminStats);


// ---------------- CREATE EVENT ----------------
router.post(
  '/create-event',
  auth,
  requireRole('admin'),
  upload.single('image'),
  createEvent
);


// ---------------- GET ADMIN EVENTS ----------------
router.get(
  '/admin/events',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const events = await Event.find({ admin: req.user.id });
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);


// ---------------- DELETE EVENT ----------------
router.delete(
  '/admin/events/:id',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ msg: 'Event not found' });
      }

      if (event.admin.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized' });
      }

      await event.deleteOne();

      res.json({ msg: 'Event deleted successfully' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);


module.exports = router;