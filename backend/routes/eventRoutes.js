const express = require("express");
const router = express.Router();   // ✅ THIS WAS MISSING

const Event = require("../models/Event");
const { createEvent } = require("../controllers/Eventcontroller");
const auth = require("../middleware/auth");
const { getAllEvents } = require("../controllers/Eventcontroller");

router.get("/events", getAllEvents);
// Create Event
router.post("/create", auth, createEvent);
router.get("/events", getAllEvents);
// Get All Events
router.get("/all", auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;   // ✅ EXPORT ROUTER