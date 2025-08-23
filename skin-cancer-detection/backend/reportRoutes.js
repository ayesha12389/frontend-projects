const express = require('express');
const router = express.Router();
const Report = require('./reportModels');

// Create a new report
router.post('/reports', async (req, res) => {
  try {
    const {
      age,
      gender,
      tumorThickness,
      mitoticCount,
      category,
      anatomicalSite,
      remarks,
      img
    } = req.body;

    const newReport = new Report({
      age,
      gender,
      tumorThickness,
      mitoticCount,
      category,
      anatomicalSite,
      remarks,
      img
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error saving report', error });
  }
});

// Get all reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
});

// Get report by ID
router.get('/reports/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error });
  }
});

module.exports = router;
