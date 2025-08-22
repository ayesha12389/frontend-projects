const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const protect = async (req, res, next) => {
    let token;

    // Check for token in the authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Move this line up to avoid logging undefined token
        console.log('Extracted Token:', token); // Log after extracting the token

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            // Check if user exists
            if (!req.user) {
                return res.status(404).json({ message: 'User not found. Please check the token and try again.' });
            }

            next();
        } catch (error) {
            console.error('Token error:', error);

            // Handle specific JWT errors
            if (error.name === 'JsonWebTokenError') {
                res.status(401).json({ message: 'Invalid token. Please provide a valid token.' });
            } else if (error.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Token has expired. Please log in again to obtain a new token.' });
            } else {
                res.status(401).json({ message: 'Authorization error. Please check your token.' });
            }
        }
    } else {
        res.status(401).json({ message: 'Not authorized. No token provided. Please log in to obtain a token.' });
    }
};

module.exports = { protect };

