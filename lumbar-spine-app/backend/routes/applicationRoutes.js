// src/routes/adminDoctorApplications.js
const express = require('express');
const router = express.Router();
const DoctorApp = require('../Models/doctorApp');
const User = require('../Models/userModel');
const nodemailer = require('nodemailer');

// src/routes/adminDoctorApplications.js (transporter setup)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,           // or 587
  secure: true,        // true for port 465, false for 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});


// GET all pending doctor applications
router.get('/admin/doctor-applications', async (req, res) => {
  try {
    const apps = await DoctorApp.find({ status: 'Pending' })
      .populate('user', 'email role')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a single application by ID
router.get('/admin/doctor-applications/:id', async (req, res) => {
  try {
    const app = await DoctorApp.findById(req.params.id)
      .populate('user', 'email role');
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// helper to send notification email
async function sendStatusEmail(to, subject, text) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text
  });
}

// Approve application: set status, upgrade user role, notify
router.post('/:id/approve', async (req, res) => {
  try {
    const app = await DoctorApp.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Not found' });

    app.status = 'Verified';
    await app.save();

    // update user role
    const user = await User.findById(app.user);
    user.role = 'doctor';
    await user.save();

    // send email
    await sendStatusEmail(
      user.email,
      'Your Doctor Application Approved',
      `Congratulations ${app.fullName}, your account has been upgraded to Doctor.`
    );

    res.json({ message: 'Application approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject application: set status, notify
router.post('/:id/reject', async (req, res) => {
  try {
    const app = await DoctorApp.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Not found' });

    app.status = 'Rejected';
    await app.save();

    // notify user
    const user = await User.findById(app.user);
    await sendStatusEmail(
      user.email,
      'Your Doctor Application Status',
      `Hello ${app.fullName}, unfortunately your doctor application was not approved.`
    );

    res.json({ message: 'Application rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
