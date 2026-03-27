const cron = require('node-cron');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');
const { getEventReminderEmail } = require('./emailTemplates');
const sendEmail = require('./sendemail');

/**
 * reminderJob.js
 * Scans for upcoming events (< 7 days) every day at midnight 
 * and notifies students with accepted registrations.
 */

const initReminderJob = () => {
  // Run every day at 00:00 (Midnight)
  // To test: Use '*/1 * * * *' for every minute
  cron.schedule('0 0 * * *', async () => {
    console.log('[ReminderJob] Starting daily event scan...');
    
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      // 1. Find all accepted registrations for events happening in the next 7 days
      const registrations = await Registration.find({
        status: 'accepted'
      }).populate({
        path: 'event',
        match: {
          eventDate: { $gt: today, $lte: nextWeek }
        }
      }).populate('user', 'name email');

      // Filter out registrations where event match failed
      const upcomingRegistrations = registrations.filter(r => r.event);

      console.log(`[ReminderJob] Found ${upcomingRegistrations.length} upcoming registrations to notify.`);

      for (const reg of upcomingRegistrations) {
        // 2. Check if we've already sent a reminder for this event (to avoid spamming)
        // We'll search for an existing 'reminder' type notification for this user/event
        const existingReminder = await Notification.findOne({
          user: reg.user._id,
          message: { $regex: reg.event.title, $options: 'i' },
          type: 'reminder' // We'll use a specific type for reminders
        });

        if (existingReminder) {
          console.log(`[ReminderJob] Reminder already exists for ${reg.user.email} -> ${reg.event.title}. Skipping.`);
          continue;
        }

        // 3. Create In-App Notification
        try {
          await Notification.create({
            user: reg.user._id,
            type: 'reminder',
            icon: '📅',
            message: `Reminder: Your event "${reg.event.title}" is coming up on ${new Date(reg.event.eventDate).toDateString()}!`,
          });
        } catch (notifErr) {
          console.error(`[ReminderJob] Notification failed for ${reg.user.email}:`, notifErr.message);
        }

        // 4. Send Branded Reminder Email
        try {
          const reminderHtml = getEventReminderEmail(reg.firstName || reg.user.name, reg.event);
          await sendEmail(
            reg.email || reg.user.email,
            `Upcoming Event Reminder: ${reg.event.title} 📅`,
            `Your event "${reg.event.title}" is happening soon!`,
            reminderHtml
          );
        } catch (emailErr) {
          console.error(`[ReminderJob] Email failed for ${reg.user.email}:`, emailErr.message);
        }
      }

      console.log('[ReminderJob] Daily scan completed.');
    } catch (err) {
      console.error('[ReminderJob] Critical Error:', err.message);
    }
  });
};

module.exports = initReminderJob;
