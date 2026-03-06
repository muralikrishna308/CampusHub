const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

exports.getAdminStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ eventDate: { $gte: new Date() } });
    const totalRegistrations = await Registration.countDocuments();
    const totalUsers = await User.countDocuments();

    // Total Revenue calculation
    const revenueAgg = await Registration.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventDetails'
        }
      },
      { $unwind: '$eventDetails' },
      { $group: { _id: null, total: { $sum: '$eventDetails.ticketPrice' } } }
    ]);
    const totalRevenue = revenueAgg?.[0]?.total || 0;

    // Growth (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentRegs = await Registration.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const prevRegs = await Registration.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
    const growth = prevRegs === 0 ? (recentRegs > 0 ? 100 : 0) : Math.round(((recentRegs - prevRegs) / prevRegs) * 100);

    // All events with registration counts and revenue
    const events = await Event.aggregate([
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'event',
          as: 'regs'
        }
      },
      {
        $addFields: {
          registered: { $size: '$regs' },
          revenue: { $multiply: [{ $size: '$regs' }, { $ifNull: ['$ticketPrice', 0] }] }
        }
      },
      { $sort: { eventDate: -1 } }
    ]);

    // Format events for frontend (matching SuperAdminDashboard status logic)
    const formattedEvents = events.map(ev => ({
      ...ev,
      status: new Date(ev.eventDate) < new Date() ? 'completed' : 'upcoming',
      capacity: 100 // Default if not in model
    }));

    // All users with event registration count
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'user',
          as: 'regs'
        }
      },
      {
        $addFields: {
          eventCount: { $size: '$regs' }
        }
      },
      { $project: { password: 0 } },
      { $sort: { createdAt: -1 } }
    ]);

    // Recent Activity
    const recentActivity = [];
    const latestRegs = await Registration.find().sort({ createdAt: -1 }).limit(3).populate('user', 'name').populate('event', 'title');
    const latestUsers = await User.find().sort({ createdAt: -1 }).limit(2);

    latestRegs.forEach(r => {
      recentActivity.push({
        id: `reg-${r._id}`,
        action: 'New registration',
        user: r.user?.name || 'Unknown',
        event: r.event?.title || 'Unknown',
        time: r.createdAt,
        icon: '📝'
      });
    });

    latestUsers.forEach(u => {
      recentActivity.push({
        id: `user-${u._id}`,
        action: 'New user joined',
        user: u.name,
        event: 'Platform',
        time: u.createdAt,
        icon: '👤'
      });
    });

    // Registration Trends (Last 7 months)
    const trends = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const count = await Registration.countDocuments({ createdAt: { $gte: start, $lte: end } });
      trends.push({ month: months[d.getMonth()], registrations: count });
    }

    res.json({
      totalEvents,
      activeEvents,
      totalRegistrations,
      totalUsers,
      totalRevenue,
      growth,
      events: formattedEvents,
      users,
      recentActivity: recentActivity.sort((a, b) => b.time - a.time),
      trends
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      location,
      registrationEndDate,
      ticketPrice
    } = req.body;

    const event = new Event({
      title,
      description,
      eventDate,
      location,
      registrationEndDate,
      ticketPrice: ticketPrice || null,
      image: req.file ? req.file.filename : null,
      admin: req.user.id
    });

    await event.save();

    res.status(201).json(event);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};