const express = require('express');
const router = express.Router();
const Contact = require('./Contact');  // Contact model

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(200).json({ status: 'success', message: 'Message submitted successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
