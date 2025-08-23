// /backend/controllers/adminController.js
const User = require('../userModel');
const path = require('path');


exports.updateUserRole = async (req, res) => {
    const { userId, newRole } = req.body;

    if (!['editor', 'admin'].includes(newRole)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.role = newRole;
        await user.save();
        res.json({ message: 'User role updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = req.user; // Assuming user data is available on the request object
      console.log(req.user)
        res.json({
            fullName: user.fullName,
            email: user.email,
            contactNumber: user.contactNumber,
            profileImage: user.profileImage, // Construct the URL for profile image
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = req.user; // Assuming user data is available on the request object

        // Update fields only if new values are provided
        if (req.body.fullName) {
            user.fullName = req.body.fullName;
        }
        if (req.body.contactNumber) {
            user.contactNumber = req.body.contactNumber;
        }

        // If there's a new profile image
        if (req.file) {
            user.profileImage = req.file.filename; // Save the file name
        }

        await user.save(); // Save the updated user data
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { getUserProfile, updateUserProfile };



