const Registration = require('../models/Registration');
const Event = require('../models/Event');
const sendEmail = require('../utils/sendemail');

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      eventId,
      firstName,
      lastName,
      email,
      phone,
      department,
      year,
      college,
      city,
      gender
    } = req.body;

    // 1️⃣ Check event
    const event = await Event.findById(eventId).populate("admin", "name email");

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // 2️⃣ Check if already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      user: userId
    });

    if (existingRegistration) {
      if (existingRegistration.status === 'rejected') {
        // If it was rejected, we allow them to try again by updating it back to pending
        existingRegistration.status = 'pending';
        // You might want to update other fields if they were changed
        await existingRegistration.save();
        return res.status(200).json({ 
          msg: "Registration re-submitted for approval", 
          registration: existingRegistration 
        });
      }
      return res.status(400).json({ msg: "You are already registered for this event" });
    }

    // 3️⃣ Check capacity
    const totalRegistrations = await Registration.countDocuments({ event: eventId });

    if (event.capacity && totalRegistrations >= event.capacity) {
      return res.status(400).json({ msg: "Event is full" });
    }

    // 4️⃣ Create registration
    const registration = await Registration.create({
      event: eventId,
      user: userId,
      admin: event.admin._id,
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

    // 5️⃣ Send confirmation email
    try {
      await sendEmail(
        email,
        "Event Registration Successful 🎉",
        `
Hello ${firstName},

You have successfully registered for the event.

Event Details
-------------------------
Event Name: ${event.title}
Date: ${new Date(event.eventDate).toDateString()}
Location: ${event.location}
Ticket Price: ₹${event.ticketPrice || 0}

Registration Details
-------------------------
Name: ${firstName} ${lastName}
Email: ${email}

Please arrive at least 15 minutes before the event start time.

Best Regards,
Campus Event Hub Team
`
      );
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
    }

    // 6️⃣ Populate fields
    await registration.populate("event", "title eventDate location");
    await registration.populate("admin", "name email");

    res.status(201).json({
      msg: "Successfully registered for the event",
      registration
    });

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
      .populate("event", "title eventDate location description image ticketPrice")
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    res.json(registrations);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// Get registrations for a specific event (admin)
exports.getEventRegistrations = async (req, res) => {
  try {

    const { eventId } = req.params;
    const adminId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (event.admin.toString() !== adminId && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate("user", "name email college department")
      .sort({ createdAt: -1 });

    res.json(registrations);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// Get all registrations for admin events
exports.getAdminRegistrations = async (req, res) => {
  try {

    const adminId = req.user.id;

    const events = await Event.find({ admin: adminId });

    const eventIds = events.map(e => e._id);

    const registrations = await Registration.find({
      event: { $in: eventIds }
    })
      .populate("event", "title eventDate location")
      .populate("user", "name email")
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
      return res.status(404).json({ msg: "Registration not found" });
    }

    if (registration.user.toString() !== userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Registration.findByIdAndDelete(registrationId);

    res.json({ msg: "Registration cancelled successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Accept registration (admin)
exports.acceptRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const adminId = req.user.id;

    const registration = await Registration.findById(registrationId)
      .populate("event")
      .populate("user", "email name");

    if (!registration) {
      return res.status(404).json({ msg: "Registration not found" });
    }

    // Ensure the admin making the request is the one who owns the event
    if (registration.event.admin.toString() !== adminId && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized to accept this registration" });
    }

    registration.status = "accepted";
    await registration.save();

    // Send email notification
    try {
      await sendEmail(
        registration.email || registration.user.email,
        "Event Registration Accepted! ✅",
        `
Hello ${registration.firstName || registration.user.name},

Great news! Your registration for the event "${registration.event.title}" has been accepted.

Event Details
-------------------------
Event Name: ${registration.event.title}
Date: ${new Date(registration.event.eventDate).toDateString()}
Location: ${registration.event.location}

We look forward to seeing you there!

Best Regards,
Campus Event Hub Team
`
      );
    } catch (emailError) {
      console.log("Acceptance email failed:", emailError.message);
    }

    res.json({ msg: "Registration accepted successfully", registration });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// Reject registration (admin)
exports.rejectRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const adminId = req.user.id;

    const registration = await Registration.findById(registrationId)
      .populate("event")
      .populate("user", "email name");

    if (!registration) {
      return res.status(404).json({ msg: "Registration not found" });
    }

    if (registration.event.admin.toString() !== adminId && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized to reject this registration" });
    }

    registration.status = "rejected";
    await registration.save();

    // Send email notification
    try {
      await sendEmail(
        registration.email || registration.user.email,
        "Event Registration Update: Rejected ❌",
        `
Hello ${registration.firstName || registration.user.name},

Unfortunately, your registration for the event "${registration.event.title}" has been rejected.

If you have any questions, please contact the event organizer.

Best Regards,
Campus Event Hub Team
`
      );
    } catch (emailError) {
      console.log("Rejection email failed:", emailError.message);
    }

    res.json({ msg: "Registration rejected successfully", registration });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

