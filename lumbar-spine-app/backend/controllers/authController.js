const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/uploads');
const path = require('path');
const crypto = require('crypto');


// Register a New User
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;   // give role a default
  const profileImage = req.file ? path.basename(req.file.path) : '';

  try {
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password : hashedPassword,
      role,                         // ✔︎ stored in DB
      profileImage
    });

    
    const token = jwt.sign(
      {
        id          : newUser._id,
        username    : newUser.username,
        role        : newUser.role,
        profileImage: newUser.profileImage
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    
    return res.status(201).json({
      token,
      user: {
        id          : newUser._id,
        username    : newUser.username,
        role        : newUser.role,
        profileImage: newUser.profileImage
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Error registering user: ' + err.message });
  }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        
        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click this link to reset your password: ${resetURL}`,
        });

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing password reset request: ' + error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params; 
    const { newPassword } = req.body;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check token expiry
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password: ' + error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                profileImage: user.profileImage, // Include profileImage
                role:user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

       
        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                profileImage: user.profileImage,
                role:user.role, 
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Error logging in: ' + error.message });
    }
};


exports.upload = upload.single('profileImage');
