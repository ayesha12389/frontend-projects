// src/models/DoctorApplication.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const documentSchema = new Schema({
  filename:    String,
  originalName:String,
  mimeType:    String,
  path:        String,
}, { _id: false });

const doctorAppSchema = new Schema({
  user: {                           // who submitted
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName:    { type: String, required: true },
  fatherName:  { type: String, required: true },
  cnicNumber:  { type: String, required: true, unique: true },
  pmdcNumber:  { type: String, required: true, unique: true },
  degreeFile:      documentSchema,
  university:      { type: String, required: true },
  passingYear:     { type: Number, required: true },
  profilePhoto:    documentSchema,
  email:           { type: String, required: true },
  contactNumber:   { type: String, required: true },
  address:         { type: String, required: true },
  documents: {
    pmdcCert:      documentSchema,
    cnicFront:     documentSchema,
    cnicBack:      documentSchema,
    degreeCert:    documentSchema,
    houseJobLetter:documentSchema
  },
  status: {
    type: String,
    enum: ['Pending','Verified','Rejected'],
    default: 'Pending'
  },
  adminNotes: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('doctorApp', doctorAppSchema);
