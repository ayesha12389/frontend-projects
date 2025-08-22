const express = require('express');
const router = express.Router();
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../Models/userModel');

router.get('/doctors', async (req, res) => {
  try {
    // Populate user info to get fullName, profileImage, email etc
    const doctors = await DoctorProfile.find()
      .populate('user', 'fullName profileImage email')
      .select('bio specialization qualifications experienceYears');

    // Map to clean response
    const result = doctors.map(doc => ({
      id: doc._id,
      userId: doc.user._id,
      fullName: doc.fullName || doc.user.fullName,
      profileImage: doc.user.profileImage,
      bio: doc.bio,
      specialization: doc.specialization,
      qualifications: doc.qualifications,
      experienceYears: doc.experienceYears
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
