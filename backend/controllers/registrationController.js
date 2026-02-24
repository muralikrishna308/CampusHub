const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId, firstName, lastName, email, phone, department, year, college, city, gender } = req.body;

    // Check if event exists and get admin
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if user already registered for this event
    const existingRegistration = await Registration.findOne({
      event: eventId,
      user: userId
    });

    if (existingRegistration) {
      return res.status(400).json({ msg: 'You are already registered for this event' });
    }

    // Create registration
    const registration = await Registration.create({
      event: eventId,
      user: userId,
      admin: event.admin,
      firstName,
      lastName,
      email,
      phone,
      department,
      year,
      college,
      city,
      gender
    });

    // Populate the registration with event and admin info
    await registration.populate('event', 'title eventDate location');
    await registration.populate('admin', 'name email');

    res.status(201).json({ msg: 'Successfully registered for the event', registration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get student's registrations
exports.getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await Registration.find({ user: userId })
      .populate('event', 'title eventDate location description image ticketPrice')
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get registrations for a specific event (admin view)
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const adminId = req.user.id;

    // Verify that the admin owns this event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    if (event.admin.toString() !== adminId && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email college department')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all registrations for an admin's events
exports.getAdminRegistrations = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Get all events created by this admin
    const events = await Event.find({ admin: adminId });
    const eventIds = events.map(e => e._id);

    // Get all registrations for these events
    const registrations = await Registration.find({ event: { $in: eventIds } })
      .populate('event', 'title eventDate location')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const userId = req.user.id;
    const { registrationId } = req.params;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ msg: 'Registration not found' });
    }

    // Verify that the registration belongs to the user
    if (registration.user.toString() !== userId) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await Registration.findByIdAndDelete(registrationId);

    res.json({ msg: 'Registration cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
