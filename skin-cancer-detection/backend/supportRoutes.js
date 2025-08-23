// routes/supportRoutes.js

const express = require('express');
const router = express.Router();
const SupportRequest = require('./SupportRequest');

// POST /api/support/submit_support
router.post('/submit_support', async (req, res) => {
  const { name, email, message } = req.body;

  // Input validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Save to MongoDB
    const newRequest = new SupportRequest({
      name,
      email,
      message
    });

    await newRequest.save();
    console.log('✅ Support request saved:', newRequest);

    return res.status(200).json({ message: 'Support request submitted successfully' });
  } catch (error) {
    console.error('❌ Error submitting support request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
