const User = require('../userModel');

const getUserProfile = async (req, res) => {
    try {
        console.log('Request User:', req.user); // Log the user object
        console.log('User ID:', req.user.id); // Log the user ID

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            console.error('Invalid User ID format:', req.user.id);
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        // Fetch user from database
        const user = await User.findById(req.user.id);
        if (!user) {
            console.error('User not found with ID:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        // Send response
        res.json({
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
};



// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update only the allowed fields
        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.emain || user.email;

        if (req.file) { // If there's a new profile image
            user.profileImage = req.file.path; // Save the file path
        }

        await user.save(); // Save the updated user data
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserProfile, updateUserProfile };
