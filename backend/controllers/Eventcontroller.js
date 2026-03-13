const Event = require("../models/Event");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      location,
      registrationEndDate,
      ticketPrice,
      image,
      category
    } = req.body;

    const event = new Event({
      title,
      description,
      eventDate,
      location,
      registrationEndDate,
      ticketPrice,
      image,
      category,
      admin: req.user?.id
    });

    await event.save();
    res.status(201).json(event);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 });

    res.status(200).json(events);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};