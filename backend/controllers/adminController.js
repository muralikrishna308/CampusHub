const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getAdminStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ active: true });
    const totalRegistrations = await Registration.countDocuments();

    // average participants: sum participants / total events (safe)
    const agg = await Event.aggregate([
      { $group: { _id: null, totalParticipants: { $sum: '$participants' } } }
    ]);
    const totalParticipants = agg?.[0]?.totalParticipants || 0;
    const avgParticipants = totalEvents ? Math.round(totalParticipants / totalEvents) : 0;

    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5).select('title date participants active');

    res.json({ totalEvents, activeEvents, totalRegistrations, avgParticipants, recentEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    // registrations by this user
    const myRegistrations = await Registration.find({ user: userId }).populate('event', 'title date');
    // upcoming events (active)
    const upcomingEvents = await Event.find({ active: true }).sort({ date: 1 }).limit(5).select('title date participants');

    res.json({ myRegistrations, upcomingEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
