const express = require("express");
const router = express.Router();   // ✅ THIS WAS MISSING

const Event = require("../models/Event");
const { createEvent } = require("../controllers/Eventcontroller");
const auth = require("../middleware/auth");

// Create Event
router.post("/create", auth, createEvent);

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