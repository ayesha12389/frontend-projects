// src/models/ScanResult.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const scanResultSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  model: {
    type: String,
    enum: ['spinaCore', 'structura', 'lumbot'],
    required: true
  },
  inputFile: {
    filename: String,
    originalname: String,
    contentType: String,
    path: String
  },
  metadata: {
    condition: { type: String },
    level:     { type: String }
  },
  output: {
    // For spinaCore and lumbot
    severity:    { type: String },
    confidence:  { type: Number },
    // For structura
    results:     { type: Schema.Types.Mixed },
    // For lumbot additional
    coordinates: [{ type: Number }],
    heatmapUrl:  { type: String }
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('ScanResult', scanResultSchema);
