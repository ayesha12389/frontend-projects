const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/uploads'); // Import multer configuration
const { updateUserProfile, getUserProfile } = require('../controllers/adminController'); // Import controllers
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware
const User = require('../Models/userModel'); // Import the User model
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');
router.put('/profile', authMiddleware.protect, upload.single('profileImage'), updateUserProfile);
 router.get('/profile', authMiddleware.protect, getUserProfile);

router.get('/', authMiddleware.protect, async (req, res) => {
    try {
        const users = await User.find({}, 'fullName email profileImage role');
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});
router.get('/count', async (req, res) => {
  try {
    const { role, status, startDate, endDate } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const total = await User.countDocuments(filter);
    res.json({ total });
  } catch (err) {
    console.error('User count error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});
// Define the route for updating user role
router.put('/:id/role', authMiddleware.protect, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
});
router.put('/password', authMiddleware.protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Fetch the user from the database
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Save the updated user
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password' });
    }
});

router.delete('/:id', authMiddleware.protect, async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});


module.exports = router;
