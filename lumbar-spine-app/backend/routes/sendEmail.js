// src/utils/mailer.js
const nodemailer = require('nodemailer');

// create a reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,            // SSL port
  secure: true,         // use SSL
  auth: {
    user: process.env.GMAIL_USER,         // your Gmail address
    pass: process.env.GMAIL_PASS // your 16-char App Password
  }
});

/**
 * Send an email.
 * @param {string} to       – recipient email
 * @param {string} subject  – email subject line
 * @param {string} text     – plain-text body
 * @param {string} [html]   – optional HTML body
 */
async function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: `"Lumbar" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    ...(html && { html })
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
