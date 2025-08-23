const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const reportRoutes = require('./reportRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const supportRoutes = require('./supportRoutes');
const contactRoutes = require('./contactRoutes');  // ✅ NEW

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/', reportRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/contact', contactRoutes);  // ✅ Mount contact form API

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/skin_cancer_detection';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
