// src/routes/meta.route.js
const express = require('express');
const router  = express.Router();


// GET /api/meta/universities?country=Pakistan
router.get('/meta/universities', async (req, res) => {
  const country = req.query.country || '';
  const url = `https://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    // only send back the names
    return res.json(data.map(u => u.name));
  } catch (err) {
    console.error('Meta → universities error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// You can do the same for cities if needed...
module.exports = router;
