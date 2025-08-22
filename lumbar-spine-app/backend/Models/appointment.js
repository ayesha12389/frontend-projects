// models/Appointment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  doctor:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  patient:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date:      { type: Date, required: true },  // date of appointment (only date part)
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime:   { type: String, required: true }  // e.g. "09:30"
}, { timestamps: true });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
