const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  mitoticCount: { type: String, required: true },     // Capital S
  category: { type: String, required: true },
  anatomicalSite: { type: String, required: true },
  remarks: { type: String },
  img: { type: String }, // image URL ya path
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
