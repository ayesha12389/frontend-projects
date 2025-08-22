const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const reportRoutes=require('./routes/reportRoutes')
const authRoutes = require('./routes/authRoutes');
const contactRoutes=require('./routes/contactRoutes');
const userRoutes=require('./routes/userRoutes');
const doctorRouter = require('./routes/doctorRoutes');
const applicationRoutes=require('./routes/applicationRoutes')
// const { doctorProfileRouter } = require('./routes/doctorProfile');
// const { appointmentRouter }   = require('./routes/appointments');
const doctorProfile=require('./routes/doctorProfile');


const doctorListRoutes = require('./routes/doctorListRoute');
const appointmentRoutes = require('./routes/appointmentRoutes');
const app = express();


require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/', reportRoutes);
app.use('/contact', contactRoutes);
app.use('/api/user', userRoutes);
app.use('/api', doctorRouter);
app.use('/api',applicationRoutes);
app.use('/api',doctorProfile);
app.use('/api/auth', authRoutes);
app.use('/api', doctorListRoutes);
app.use('/api',appointmentRoutes)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ML';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
