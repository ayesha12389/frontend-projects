const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Appointment = require('../Models/appointment');
const User = require('../Models/userModel');
const sendEmail = require('../utils/sendEmail'); // Make sure this exists

function validateObjectId(req, res, next) {
  const id = req.params.doctorId || req.params.patientId || req.params.appointmentId;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
}

// Count appointments by doctor/patient
router.get('/appointments/count', async (req, res) => {
  try {
    const { doctor, patient } = req.query;
    const filter = {};
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;

    const count = await Appointment.countDocuments(filter);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all appointments (admin)
router.get('/appointments/all', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'username profileImage')
      .populate('patient', 'username email profileImage');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get appointments for a doctor
router.get('/appointments/doctor/:doctorId', validateObjectId, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    const query = { doctor: doctorId };

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query.date = { $gte: dayStart, $lte: dayEnd };
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'username profileImage')
      .populate('patient', 'username email profileImage');

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get appointments for a patient
router.get('/appointments/patient/:patientId', validateObjectId, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { date } = req.query;
    const query = { patient: patientId };

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query.date = { $gte: dayStart, $lte: dayEnd };
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'username profileImage');

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Book new appointment (with email notifications)
router.post('/appointments', async (req, res) => {
  try {
    const { doctor, patient, date, startTime, endTime } = req.body;
    if (!doctor || !patient || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const exists = await Appointment.findOne({
      doctor,
      date: new Date(date),
      startTime
    });
    if (exists) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({ doctor, patient, date, startTime, endTime });

    const doctorInfo = await User.findById(doctor);
    const patientInfo = await User.findById(patient);

    await sendEmail({
      to: doctorInfo.email,
      subject: 'New Appointment Booked',
      html: `<p>You have a new appointment with <strong>${patientInfo.username}</strong> on <strong>${date}</strong> from <strong>${startTime}</strong> to <strong>${endTime}</strong>.</p>`
    });

    await sendEmail({
      to: patientInfo.email,
      subject: 'Appointment Confirmed',
      html: `<p>Your appointment with <strong>Dr. ${doctorInfo.username}</strong> is confirmed for <strong>${date}</strong> from <strong>${startTime}</strong> to <strong>${endTime}</strong>.</p>`
    });

    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel appointment (with email notifications)
router.delete('/appointments/:appointmentId', validateObjectId, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const doctorInfo = await User.findById(appointment.doctor);
    const patientInfo = await User.findById(appointment.patient);

    await appointment.deleteOne();

    await sendEmail({
      to: doctorInfo.email,
      subject: 'Appointment Cancelled',
      html: `<p>Your appointment with <strong>${patientInfo.username}</strong> on <strong>${appointment.date}</strong> from <strong>${appointment.startTime}</strong> to <strong>${appointment.endTime}</strong> has been cancelled.</p>`
    });

    await sendEmail({
      to: patientInfo.email,
      subject: 'Your Appointment Has Been Cancelled',
      html: `<p>Your appointment with <strong>Dr. ${doctorInfo.username}</strong> on <strong>${appointment.date}</strong> from <strong>${appointment.startTime}</strong> to <strong>${appointment.endTime}</strong> has been cancelled.</p>`
    });

    res.json({ message: 'Appointment canceled and emails sent' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
