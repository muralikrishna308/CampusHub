/**
 * emailTemplates.js
 * Centralized professional HTML email templates for Campus Event Hub
 */

const baseStyle = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #1F2937;
  background-color: #F9FAFB;
  padding: 40px 20px;
`;

const containerStyle = `
  max-width: 600px;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const headerStyle = `
  background-color: #7C3AED;
  padding: 30px;
  text-align: center;
  color: #FFFFFF;
`;

const bodyStyle = `
  padding: 40px 30px;
`;

const footerStyle = `
  padding: 30px;
  text-align: center;
  font-size: 14px;
  color: #6B7280;
  border-top: 1px solid #E5E7EB;
`;

const buttonStyle = `
  display: inline-block;
  padding: 12px 24px;
  background-color: #7C3AED;
  color: #FFFFFF;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  margin-top: 20px;
`;

const wrapTemplate = (content, previewText) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Campus Event Hub</title>
    </head>
    <body style="${baseStyle}">
      ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>` : ''}
      <div style="${containerStyle}">
        <div style="${headerStyle}">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.025em;">🎓 Campus Event Hub</h1>
        </div>
        <div style="${bodyStyle}">
          ${content}
        </div>
        <div style="${footerStyle}">
          &copy; ${new Date().getFullYear()} Campus Event Hub. All rights reserved.<br/>
          Empowering student connections, one event at a time.
        </div>
      </div>
    </body>
  </html>
`;

// 1. Welcome Email
exports.getWelcomeEmail = (name) => {
  const content = `
    <h2 style="margin-top: 0; color: #111827;">Welcome aboard, ${name}! 🚀</h2>
    <p>We're thrilled to have you join <strong>Campus Event Hub</strong>, the ultimate platform for discovering and participating in college events.</p>
    <p>From hackathons and tech fests to sports meets and cultural festivals, your campus journey just got a lot more exciting.</p>
    <p>Get started by exploring upcoming events:</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/events" style="${buttonStyle}">Explore Events</a>
    </div>
    <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email!</p>
    <p>Best Regards,<br/><strong>The Campus Event Hub Team</strong></p>
  `;
  return wrapTemplate(content, "Welcome to the ultimate campus event platform!");
};

// 2. OTP Email
exports.getOTPEmail = (otp) => {
  const content = `
    <h2 style="margin-top: 0; color: #111827;">Password Reset Request</h2>
    <p>We received a request to reset your password. Use the following 6-digit verification code to proceed:</p>
    <div style="background-color: #F3F4F6; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
      <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #7C3AED;">${otp}</span>
    </div>
    <p>This code is valid for <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
    <p>Best Regards,<br/><strong>Campus Event Hub Security Team</strong></p>
  `;
  return wrapTemplate(content, `Your verification code is ${otp}`);
};

// 3. Event Registration Confirmation (Pending)
exports.getRegistrationConfirmationEmail = (name, event) => {
  const content = `
    <h2 style="margin-top: 0; color: #111827;">Registration Received! 📝</h2>
    <p>Hello ${name},</p>
    <p>Your registration for <strong>${event.title}</strong> has been successfully submitted and is currently <strong>pending approval</strong> by the organizer.</p>
    
    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="margin-top: 0; font-size: 16px; color: #374151;">Event Details</h3>
      <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date(event.eventDate).toDateString()}</p>
      <p style="margin-bottom: 5px;"><strong>Location:</strong> ${event.location}</p>
      <p style="margin-bottom: 0;"><strong>Price:</strong> ₹${event.ticketPrice || 0}</p>
    </div>

    <p>We'll notify you as soon as the organizer reviews your registration.</p>
    <p>Best Regards,<br/><strong>Campus Event Hub Team</strong></p>
  `;
  return wrapTemplate(content, `Registration received for ${event.title}`);
};

// 4. Registration Accepted
exports.getRegistrationAcceptedEmail = (name, event) => {
  const content = `
    <h2 style="margin-top: 0; color: #059669;">Registration Approved! ✅</h2>
    <p>Hello ${name},</p>
    <p>Great news! Your registration for <strong>${event.title}</strong> has been <strong>accepted</strong>.</p>
    
    <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="margin-top: 0; font-size: 16px; color: #065F46;">Event Details</h3>
      <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date(event.eventDate).toDateString()}</p>
      <p style="margin-bottom: 0;"><strong>Location:</strong> ${event.location}</p>
    </div>

    <p>We look forward to seeing you there! Please make sure to arrive on time.</p>
    <p>Best Regards,<br/><strong>Campus Event Hub Team</strong></p>
  `;
  return wrapTemplate(content, `Your registration for ${event.title} has been accepted!`);
};

// 5. Registration Rejected
exports.getRegistrationRejectedEmail = (name, event) => {
  const content = `
    <h2 style="margin-top: 0; color: #DC2626;">Registration Update ❌</h2>
    <p>Hello ${name},</p>
    <p>We regret to inform you that your registration for <strong>${event.title}</strong> has not been accepted at this time.</p>
    
    <p>Event organizers often have limited capacity or specific criteria for selection. Don't let this stop you — there are many other exciting events waiting for you!</p>

    <div style="text-align: center;">
      <a href="http://localhost:3000/events" style="${buttonStyle}">Find Other Events</a>
    </div>

    <p style="margin-top: 30px;">Best Regards,<br/><strong>Campus Event Hub Team</strong></p>
  `;
  return wrapTemplate(content, `Update on your registration for ${event.title}`);
};

// 6. Admin Registration Alert
exports.getAdminRegistrationAlertEmail = (adminName, studentName, eventTitle) => {
  const content = `
    <h2 style="margin-top: 0; color: #111827;">New Registration Received! 📝</h2>
    <p>Hello ${adminName},</p>
    <p>A new student, <strong>${studentName}</strong>, has just registered for your event <strong>"${eventTitle}"</strong>.</p>
    
    <p>You can review and manage this registration from your admin dashboard:</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/admin" style="${buttonStyle}">Review Registrations</a>
    </div>

    <p style="margin-top: 30px;">Best Regards,<br/><strong>Campus Event Hub System</strong></p>
  `;
  return wrapTemplate(content, `${studentName} registered for ${eventTitle}`);
};

// 7. Upcoming Event Reminder
exports.getEventReminderEmail = (name, event) => {
  const content = `
    <h2 style="margin-top: 0; color: #7C3AED;">Upcoming Event Reminder 📅</h2>
    <p>Hello ${name},</p>
    <p>This is a friendly reminder that the event <strong>"${event.title}"</strong> is happening in less than a week!</p>
    
    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="margin-top: 0; font-size: 16px; color: #374151;">Event Countdown</h3>
      <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date(event.eventDate).toDateString()}</p>
      <p style="margin-bottom: 5px;"><strong>Time:</strong> ${event.time || "See event details"}</p>
      <p style="margin-bottom: 0;"><strong>Location:</strong> ${event.location}</p>
    </div>

    <p>We hope you're excited! Make sure to save the date and invite your friends.</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/events" style="${buttonStyle}">View Event Details</a>
    </div>

    <p style="margin-top: 30px;">Best Regards,<br/><strong>Campus Event Hub Team</strong></p>
  `;
  return wrapTemplate(content, `Reminder: ${event.title} is coming up soon!`);
};
