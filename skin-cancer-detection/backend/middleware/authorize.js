// /backend/middleware/authorize.js
const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const userRole = req.user.role; // Assuming user role is set in a previous middleware

        if (roles.length && !roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    };
};

module.exports = authorize;
