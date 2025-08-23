const express = require('express');
const router = express.Router();
const upload = require('./middleware/uploads'); // Ensure middleware is correctly imported
const { register, login,forgotPassword, resetPassword  } = require('./controllers/authController');// Ensure the controller is correctly imported

// Define the register route
router.post('/register', upload.single('profileImage'), register); // This should match the POST request
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Route for reset password
router.put('/reset-password/:token', resetPassword);
module.exports = router;
