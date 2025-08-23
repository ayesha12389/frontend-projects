const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
 
  profileImage: { type: String },
  resetPasswordToken: { type: String }, // Token for resetting password
  resetPasswordExpires: { type: Date }, // Expiration time for the token
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
