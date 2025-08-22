// src/models/DoctorProfile.js
const mongoose = require('mongoose');
const { Schema } = mongoose;



// Main DoctorProfile schema
const doctorProfileSchema = new Schema({
  user:            { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio:             { type: String, default: '' },
  specialization:  { type: String, required: true },           // e.g. "Cardiologist"
  qualifications:  { type: [String], default: [] },             // e.g. ["MBBS", "MD"]
  experienceYears: { type: Number, default: 0 },                // e.g. 5
 
}, { timestamps: true });

module.exports = mongoose.models.DoctorProfile
  || mongoose.model('DoctorProfile', doctorProfileSchema);
