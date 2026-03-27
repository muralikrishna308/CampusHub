const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html = null) => {
  try {
    if (!to) {
      console.warn("[Email] Warning: Recipient address ('to') is missing. Skipping email.");
      return null;
    }
    console.log(`[Email] Attempting to send to: ${to} (HTML: ${!!html})`);
    
    // Using 'service: gmail' is the standard for Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const mailOptions = {
      from: `Campus Event Hub <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Success! Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Email] CRITICAL ERROR: ${error.message}`);
    // Check for common auth errors
    if (error.message.includes('Invalid login')) {
      console.error("[Email] Hint: Check your EMAIL_USER and EMAIL_PASS (App Password) in .env");
    }
    throw error; // Let the controller handle the response
  }
};

module.exports = sendEmail;