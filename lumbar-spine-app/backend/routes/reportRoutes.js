// src/routes/scan.route.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ScanResult = require('../Models/reportModels');
const auth = require('../middleware/authMiddleware'); // ensure you have middleware to extract req.user

// POST /api/scan
router.post('/reports',  async (req, res) => {
  try {
    const { name, model, user,metadata, output } = req.body;
   
    if (!name || !model || !user || !output) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build new ScanResult document
    const scan = new ScanResult({
      name,
      user,       // set by auth middleware
      model,
      metadata,
      output
    });

    // Save to MongoDB
    await scan.save();

    return res.status(201).json(scan);
  } catch (err) {
    console.error('Error saving scan:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/scans/count', async (req, res) => {
  try {
    const { search = '', startDate, endDate } = req.query;

    const filter = {
      $and: [
        {
          $or: [
            { name: new RegExp(search, 'i') },
            { 'metadata.condition': new RegExp(search, 'i') }
          ]
        }
      ]
    };

    // Add date range filter if provided
    if (startDate || endDate) {
      filter.$and.push({
        createdAt: {}
      });
      if (startDate) filter.$and[filter.$and.length - 1].createdAt.$gte = new Date(startDate);
      if (endDate)   filter.$and[filter.$and.length - 1].createdAt.$lte = new Date(endDate);
    }

    const totalCount = await ScanResult.countDocuments(filter);
    res.json({ totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/scans/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, page = 1, perPage = 15 } = req.query;

    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const filter = { user: userId };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const totalCount = await ScanResult.countDocuments(filter);

    

    res.json({ totalCount  }); // ✅ changed key name to totalCount
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/report/:scanId', async (req, res) => {
  try {
    const scan = await ScanResult.findById(req.params.scanId).lean();
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    res.json(scan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching scan' });
  }
});
router.get('/scans', async (req, res) => {
  try {
    const {
      search  = '',
      page    = 1,
      perPage = 15,
      userId
    } = req.query;

    const pg = parseInt(page,    10);
    const pp = parseInt(perPage, 10);

    // build filter with optional user restriction
    const filter = {
      $and: [
        {
          $or: [
            { name:               new RegExp(search, 'i') },
            { 'metadata.condition': new RegExp(search, 'i') }
          ]
        },
        ...(userId ? [{ user: userId }] : [])
      ]
    };

    const total = await ScanResult.countDocuments(filter);
    const scans = await ScanResult.find(filter)
      .sort({ createdAt: -1 })
      .skip((pg - 1) * pp)
      .limit(pp)
      .lean();

    res.json({ total, scans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/scan/:id
router.delete('/scan/:id', async (req, res) => {
  try {
    await ScanResult.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/model-summary", async (req, res) => {
  try {
    const { start, end } = req.query;

    const startDate = start ? new Date(start) : new Date("2000-01-01");
    const endDate = end ? new Date(end) : new Date();

    const reports = await ScanResult.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const result = {
      spinaCore: {},
      structura: {},
      lumbot: {},
      severityCount: {
        Normal: 0,
        Moderate: 0,
        Severe: 0,
      }
    };

    const monthMap = (date) => new Date(date).toISOString().slice(0, 7);
    const models = ["spinaCore", "structura", "lumbot"];

    const cleanSeverity = (raw) => {
      if (typeof raw !== "string") return null;
      return raw.split("/")[0].trim();
    };

    for (const doc of reports) {
      const { model, output, createdAt } = doc;
      const month = monthMap(createdAt);

      if (!models.includes(model)) continue;

      if (!result[model][month]) {
        result[model][month] = {
          totalConfidence: 0,
          count: 0,
          avgConfidence: 0,
        };
      }

      if (model === "spinaCore") {
        const confidence = output?.confidence || 0;
        const severity = cleanSeverity(output?.severity);

        result[model][month].totalConfidence += confidence;
        result[model][month].count += 1;

        if (severity && result.severityCount[severity] !== undefined) {
          result.severityCount[severity]++;
        }
      }

      else if (model === "structura") {
        const resultSet = output?.results || {};
        for (const r of Object.values(resultSet)) {
          const confidence = r?.Confidence || 0;
          const severity = cleanSeverity(r?.Severity || r?.severity);

          result[model][month].totalConfidence += confidence;
          result[model][month].count += 1;

          if (severity && result.severityCount[severity] !== undefined) {
            result.severityCount[severity]++;
          }
        }
      }

      else if (model === "lumbot") {
        const confidence = output?.coordinates?.[0] || 0;
        const severity = cleanSeverity(output?.severity);

        result[model][month].totalConfidence += confidence;
        result[model][month].count += 1;

        if (severity && result.severityCount[severity] !== undefined) {
          result.severityCount[severity]++;
        }
      }
    }

    for (const model of models) {
      for (const month in result[model]) {
        const item = result[model][month];
        item.avgConfidence = item.count
          ? (item.totalConfidence / item.count).toFixed(4)
          : "0.0000";
      }
    }

    res.status(200).json(result);

  } catch (err) {
    console.error("Error generating model summary:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/model-servity", async (req, res) => {
  try {
    const { start, end } = req.query;

    const startDate = start ? new Date(start) : new Date("2000-01-01");
    const endDate = end ? new Date(end) : new Date();

    const reports = await ScanResult.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const monthMap = (date) => new Date(date).toISOString().slice(0, 7);
    const models = ["spinaCore", "structura", "lumbot"];

    const cleanSeverity = (raw) => {
      if (typeof raw !== "string") return null;
      return raw.split("/")[0].trim();
    };

    const severitySummary = {};

    for (const doc of reports) {
      const { model, output, createdAt } = doc;
      const month = monthMap(createdAt);

      if (!models.includes(model)) continue;

      if (!severitySummary[month]) {
        severitySummary[month] = {
          lowSeverity: 0,
          moderate: 0,
          severe: 0
        };
      }

      const addSeverity = (sev) => {
        const cleaned = cleanSeverity(sev);
        if (cleaned === "Normal") severitySummary[month].lowSeverity++;
        else if (cleaned === "Moderate") severitySummary[month].moderate++;
        else if (cleaned === "Severe") severitySummary[month].severe++;
      };

      if (model === "spinaCore") {
        addSeverity(output?.severity);
      }

      else if (model === "structura") {
        const resultSet = output?.results || {};
        for (const r of Object.values(resultSet)) {
          addSeverity(r?.Severity || r?.severity);
        }
      }

      else if (model === "lumbot") {
        addSeverity(output?.severity);
      }
    }

    res.status(200).json(severitySummary);

  } catch (err) {
    console.error("Error generating model summary:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/model-summary/:userID", async (req, res) => {
  try {
    const userId = req.params.userID;
    const { start, end } = req.query;

    const startDate = start ? new Date(start) : new Date("2000-01-01");
    const endDate = end ? new Date(end) : new Date(); // defaults to now

    const reports = await ScanResult.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const result = {
      spinaCore: {},
      structura: {},
      lumbot: {},
      severityCount: {
        Normal: 0,
        Moderate: 0,
        Severe: 0,
      }
    };

    const monthMap = (date) => new Date(date).toISOString().slice(0, 7);
    const models = ["spinaCore", "structura", "lumbot"];

    for (const doc of reports) {
      const { model, output, createdAt } = doc;
      const month = monthMap(createdAt);

      if (!models.includes(model)) continue;

      if (!result[model][month]) {
        result[model][month] = {
          totalConfidence: 0,
          count: 0,
          avgConfidence: 0,
        };
      }

      if (model === "spinaCore") {
        const confidence = output?.confidence || 0;
        const severity = (output?.severity || "").split("/")[0];

        result[model][month].totalConfidence += confidence;
        result[model][month].count += 1;

        if (result.severityCount[severity] !== undefined) {
          result.severityCount[severity]++;
        }
      }

      else if (model === "structura") {
        const resultSet = output?.results || {};
        const confidences = Object.values(resultSet).map(r => r.Confidence || 0);
        const severities = Object.values(resultSet).map(r => (r.Severity || "").split("/")[0]);

        result[model][month].totalConfidence += confidences.reduce((a, b) => a + b, 0);
        result[model][month].count += confidences.length;

        for (const sev of severities) {
          if (result.severityCount[sev] !== undefined) {
            result.severityCount[sev]++;
          }
        }
      }

      else if (model === "lumbot") {
        const confidence = output?.coordinates?.[0] || 0;
        const severity = (output?.severity || "").split("/")[0];

        result[model][month].totalConfidence += confidence;
        result[model][month].count += 1;

        if (result.severityCount[severity] !== undefined) {
          result.severityCount[severity]++;
        }
      }
    }

    for (const model of models) {
      for (const month in result[model]) {
        const item = result[model][month];
        item.avgConfidence = item.count ? (item.totalConfidence / item.count).toFixed(4) : 0;
      }
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error generating model summary:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/model-servity/:userID", async (req, res) => {
  try {
    const userId = req.params.userID;
    const { start, end } = req.query;

    const startDate = start ? new Date(start) : new Date("2000-01-01");
    const endDate = end ? new Date(end) : new Date();

    const reports = await ScanResult.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const monthMap = (date) => new Date(date).toISOString().slice(0, 7);
    const models = ["spinaCore", "structura", "lumbot"];

    const result = {
      spinaCore: {},
      structura: {},
      lumbot: {},
    };

    const severityByMonth = {}; // NEW OBJECT

    const cleanSeverity = (raw) => {
      if (!raw || typeof raw !== "string") return null;
      return raw.split("/")[0].trim().toLowerCase(); // normalize
    };

    const updateSeverityCount = (month, rawSeverity) => {
      const severity = cleanSeverity(rawSeverity);
      if (!["normal", "moderate", "severe"].includes(severity)) return;

      const map = {
        normal: "lowSeverity",
        moderate: "moderate",
        severe: "severe"
      };

      const key = map[severity];

      if (!severityByMonth[month]) {
        severityByMonth[month] = {
          lowSeverity: 0,
          moderate: 0,
          severe: 0
        };
      }

      severityByMonth[month][key]++;
    };

    for (const doc of reports) {
      const { model, output, createdAt } = doc;
      const month = monthMap(createdAt);

      if (!models.includes(model)) continue;

      if (!result[model][month]) {
        result[model][month] = {
          totalConfidence: 0,
          count: 0,
          avgConfidence: 0
        };
      }

      if (model === "spinaCore") {
        const confidence = output?.confidence || 0;
        result[model][month].totalConfidence += confidence;
        result[model][month].count += 1;

        updateSeverityCount(month, output?.severity);
      }

      else if (model === "structura") {
        const resultSet = output?.results || {};
        for (const r of Object.values(resultSet)) {
          const confidence = r?.Confidence || 0;
          const severity = r?.Severity || r?.severity;
          result[model][month].totalConfidence += confidence;
          result[model][month].count += 1;
          updateSeverityCount(month, severity);
        }
      }

      else if (model === "lumbot") {
        const confidence = output?.coordinates?.[0] || 0;
        result[model][month].totalConfidence += confidence;
        result[model][month].count += 1;

        updateSeverityCount(month, output?.severity);
      }
    }

    // Final avg calculation
    for (const model of models) {
      for (const month in result[model]) {
        const item = result[model][month];
        item.avgConfidence = item.count
          ? (item.totalConfidence / item.count).toFixed(4)
          : "0.0000";
      }
    }

    // Respond with severity breakdown month-wise
    res.status(200).json(severityByMonth);

  } catch (err) {
    console.error("Error generating model summary:", err);
    res.status(500).json({ error: "Server error" });
  }
});






router.get('/summary/severity-trend', async (req, res) => {
  try {
    const { start, end, userId } = req.query;

    const startDate = start ? new Date(start) : new Date('2000-01-01');
    const endDate = end ? new Date(end) : new Date();
    endDate.setDate(endDate.getDate() + 1); // inclusive end date

    const match = {
      createdAt: { $gte: startDate, $lt: endDate }
    };
    if (userId) {
      match.user = userId; // assuming valid ObjectId string
    }

    const models = ['spinaCore', 'structura', 'lumbot'];

    const reports = await ScanResult.find(match);

    // Helper to extract month string YYYY-MM
    const monthKey = (date) => date.toISOString().slice(0, 7);

    // Normalize severity strings
    const cleanSeverity = (raw) => {
      if (typeof raw !== 'string') return null;
      return raw.split('/')[0].trim().toLowerCase();
    };

    const severitySummary = {};

    for (const doc of reports) {
      const { model, output, createdAt } = doc;
      if (!models.includes(model)) continue;

      const month = monthKey(createdAt);
      if (!severitySummary[month]) {
        severitySummary[month] = { lowSeverity: 0, moderate: 0, severe: 0 };
      }

      const addSeverity = (sev) => {
        const s = cleanSeverity(sev);
        if (!s) return;
        if (s === 'normal' || s === 'mild' || s === 'lowseverity') severitySummary[month].lowSeverity++;
        else if (s === 'moderate') severitySummary[month].moderate++;
        else if (s === 'severe') severitySummary[month].severe++;
      };

      if (model === 'spinaCore' || model === 'lumbot') {
        addSeverity(output?.severity);
      } else if (model === 'structura') {
        const resultSet = output?.results || {};
        Object.values(resultSet).forEach(r => addSeverity(r?.Severity || r?.severity));
      }
    }

    // Transform to array sorted by month asc
    const result = Object.entries(severitySummary)
      .map(([date, counts]) => ({
        date,
        ...counts
      }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    res.json(result);

  } catch (err) {
    console.error('Severity trend error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const { ObjectId } = mongoose.Types;


router.get('/summary/confidence-trend', async (req, res) => {
  try {
    const { start, end, userId } = req.query;

    // Parse start & end dates or leave undefined for now
    let startDate = start ? new Date(start) : null;
    let endDate = end ? new Date(end) : null;
    if (endDate) endDate.setDate(endDate.getDate() + 1); // inclusive end date

    // Build initial match for confidence existence + user filter if any
    const baseMatch = { 'output.confidence': { $exists: true } };
    if (userId) {
      baseMatch.user = new mongoose.Types.ObjectId(userId);
    }
    if (startDate) baseMatch.createdAt = { $gte: startDate };
    if (endDate) {
      baseMatch.createdAt = baseMatch.createdAt || {};
      baseMatch.createdAt.$lt = endDate;
    }

    // If start or end date not provided, get min/max dates for this user or overall
    if (!startDate || !endDate) {
      const dateRange = await ScanResult.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            minDate: { $min: '$createdAt' },
            maxDate: { $max: '$createdAt' },
          },
        },
      ]);
      if (dateRange.length) {
        if (!startDate) startDate = dateRange[0].minDate;
        if (!endDate) {
          endDate = dateRange[0].maxDate;
          endDate.setDate(endDate.getDate() + 1);
        }
      }
    }

    // Update match with the final dates
    baseMatch.createdAt = { $gte: startDate, $lt: endDate };

    // Determine unique counts for years and months for deciding grouping level
    const uniqueCounts = await ScanResult.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
        },
      },
      {
        $group: {
          _id: null,
          uniqueYears: { $addToSet: '$_id.year' },
          uniqueMonths: { $addToSet: { year: '$_id.year', month: '$_id.month' } },
          uniqueDays: { $addToSet: { year: '$_id.year', month: '$_id.month', day: '$_id.day' } },
        },
      },
      {
        $project: {
          uniqueYearsCount: { $size: '$uniqueYears' },
          uniqueMonthsCount: { $size: '$uniqueMonths' },
          uniqueDaysCount: { $size: '$uniqueDays' },
        },
      },
    ]);

    const { uniqueYearsCount = 0, uniqueMonthsCount = 0, uniqueDaysCount = 0 } = uniqueCounts[0] || {};

    // Decide grouping based on unique counts
    let groupId;
    if (uniqueYearsCount > 1) {
      groupId = { year: { $year: '$createdAt' } };
    } else if (uniqueMonthsCount > 1) {
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      };
    } else if (uniqueDaysCount > 1) {
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
    } else {
      // Single day data fallback
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
    }

    // Aggregate final results based on dynamic grouping
    const agg = await ScanResult.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: groupId,
          avgConfidence: { $avg: '$output.confidence' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Format response dates based on grouping level
    const result = agg.map(({ _id, avgConfidence }) => {
      let dateStr = String(_id.year);
      if (_id.month !== undefined) dateStr += '-' + String(_id.month).padStart(2, '0');
      if (_id.day !== undefined) dateStr += '-' + String(_id.day).padStart(2, '0');
      return {
        date: dateStr,
        confidence: Math.round(avgConfidence),
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Confidence trend error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
