// routes/doctorProfile.js
const express       = require('express');
const router        = express.Router();
const DoctorProfile = require('../models/DoctorProfile');
const User          = require('../Models/userModel');

// GET  /api/doctor/profile/:userId
router.get('/doctor/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // load basic user info
    const user = await User.findById(userId).select('username email profileImage');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // load or create profile
    let profile = await DoctorProfile.findOne({ user: userId });
    if (!profile) {
      profile = await DoctorProfile.create({
        user:            userId,
        fullName:'',
        specialization:  '',      // empty so frontend can fill
        qualifications:  [],
        experienceYears: 0
      });
    }

    res.json({
      fullName:       profile.fullName,
      email:          user.email,
      profileImage:   user.profileImage,
      bio:            profile.bio,
      specialization: profile.specialization,
      qualifications: profile.qualifications,
      experienceYears: profile.experienceYears
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/doctor/profile/:userId
router.post('/doctor/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fullName, bio, specialization, qualifications, experienceYears, profileImage } = req.body;


    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Optional: update the User's fullName
    if (profileImage) {
      user.profileImage = profileImage;
      await user.save();
    }

    // Upsert the DoctorProfile
    const profile = await DoctorProfile.findOneAndUpdate(
      { user: userId },
      {
       fullName:        fullName || profile.fullName,
        bio:             bio || '',
        specialization:  specialization || '',
        qualifications:  Array.isArray(qualifications) ? qualifications : [],
        experienceYears: Number(experienceYears) || 0
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Profile saved', profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
