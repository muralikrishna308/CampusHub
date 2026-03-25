const express = require("express");
const router = express.Router();   // ✅ THIS WAS MISSING

const Event = require("../models/Event");
const { createEvent, getAllEvents, getEventById } = require("../controllers/Eventcontroller");
const auth = require("../middleware/auth");

// Get All Events
router.get("/all", auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Other static routes
router.get("/events", getAllEvents);
router.post("/create", auth, createEvent);

// Dynamic ID MUST be last
router.get("/:id", auth, getEventById);

module.exports = router;   // ✅ EXPORT ROUTER