const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

module.exports = async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"Appointment System" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
