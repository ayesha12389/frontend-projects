// src/routes/doctor.route.js
require('dotenv').config();               // 1) Load .env

const express           = require('express');
const router            = express.Router();
const nodemailer        = require('nodemailer');

const { protect }       = require('../middleware/authMiddleware');
const authorize         = require('../middleware/authorize');
const upload            = require('../middleware/uploads');
const DoctorApplication = require('../Models/doctorApp');

// 2) Helper to strip out absolute filesystem paths
function mapFile(file) {
  return {
    filename:     file.filename,
    originalName: file.originalname,
    mimeType:     file.mimetype,
    path:         `/uploads/${file.filename}`   // public URL path
  };
}

// 3) Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,   // e.g. you@gmail.com
    pass: process.env.GMAIL_PASS    // your 16-char app password
  }
});

// 4) Verify SMTP config on startup
transporter.verify(err => {
  if (err) console.error('❌ Gmail SMTP config error:', err);
  else     console.log('✅ Gmail SMTP ready as', process.env.GMAIL_USER);
});

// 5) Send notification to the single ADMIN_EMAIL
async function sendAdminNotification(app) {
  const toList = process.env.ADMIN_EMAIL;
  const info = await transporter.sendMail({
    from:    `"Lumbar Spine App" <${process.env.GMAIL_USER}>`,
    to:      toList,
    subject: 'New Doctor Access Request',
    html: `
      <p>A new doctor application has been submitted:</p>
      <ul>
        <li><strong>User ID:</strong> ${app.user}</li>
        <li><strong>Full Name:</strong> ${app.fullName}</li>
        <li><strong>CNIC:</strong> ${app.cnicNumber}</li>
        <li><strong>PMDC #:</strong> ${app.pmdcNumber}</li>
      </ul>
      <p><a href="${process.env.APP_URL}/doctor/apps">Review in Admin Panel</a></p>
    `
  });
  console.log('✉️ Notification sent to:', toList, 'messageId:', info.messageId);
}

// 6) POST /api/doctor/apply — user submits application
router.post(
  '/doctor/apply',
  protect,
  upload.fields([
    { name: 'degreeFile',     maxCount: 1 },
    { name: 'profilePhoto',   maxCount: 1 },
    { name: 'pmdcCert',       maxCount: 1 },
    { name: 'cnicFront',      maxCount: 1 },
    { name: 'cnicBack',       maxCount: 1 },
    { name: 'degreeCert',     maxCount: 1 },
    { name: 'houseJobLetter', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        fullName, fatherName, cnicNumber, pmdcNumber,
        university, passingYear, email, contactNumber, address
      } = req.body;

      const f = req.files;
      const app = new DoctorApplication({
        user:        req.user._id,
        fullName,
        fatherName,
        cnicNumber,
        pmdcNumber,
        university,
        passingYear,
        email,
        contactNumber,
        address,
        degreeFile:   mapFile(f.degreeFile[0]),
        profilePhoto: mapFile(f.profilePhoto[0]),
        documents: {
          pmdcCert:      mapFile(f.pmdcCert[0]),
          cnicFront:     mapFile(f.cnicFront[0]),
          cnicBack:      mapFile(f.cnicBack[0]),
          degreeCert:    mapFile(f.degreeCert[0]),
          houseJobLetter: f.houseJobLetter
            ? mapFile(f.houseJobLetter[0])
            : undefined
        }
      });

      await app.save();

      // send notification email (fire & forget)
      sendAdminNotification(app).catch(err => {
        console.error('⚠️ Failed to send admin notification:', err);
      });

      res.status(201).json({ success: true, application: app });
    } catch (err) {
      console.error('🚨 /doctor/apply error:', err);
      res.status(500).json({ message: err.message });
    }
  }
);

// 7) GET /api/doctor/apps — admin lists & searches applications
router.get(
  '/doctor/apps',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { search = '', status, page = 1, perPage = 20 } = req.query;
      const pg      = +page;
      const pp      = +perPage;
      const filters = [];

      if (search) {
        const re = new RegExp(search, 'i');
        filters.push({ $or: [
          { fullName:   re },
          { cnicNumber: re },
          { pmdcNumber: re }
        ]});
      }
      if (status) filters.push({ status });

      const query = filters.length ? { $and: filters } : {};

      const total = await DoctorApplication.countDocuments(query);
      const applications = await DoctorApplication.find(query)
        .sort({ createdAt: -1 })
        .skip((pg - 1) * pp)
        .limit(pp)
        .lean();

      res.json({ total, applications });
    } catch (err) {
      console.error('🚨 /doctor/apps error:', err);
      res.status(500).json({ message: err.message });
    }
  }
);

// 8) PATCH /api/doctor/app/:id — admin updates status & notes
router.patch(
  '/doctor/app/:id',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      const updated = await DoctorApplication.findByIdAndUpdate(
        req.params.id,
        { status, adminNotes },
        { new: true }
      );
      res.json({ application: updated });
    } catch (err) {
      console.error('🚨 /doctor/app/:id error:', err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
