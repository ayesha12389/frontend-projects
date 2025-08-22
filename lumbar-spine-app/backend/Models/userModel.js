const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  role:          {                         // 👈 add / keep this
    type: String,
    enum: ['user', 'doctor', 'admin', 'moderator'],
    default: 'user'
  },
  profileImage: { type: String },
  resetPasswordToken: { type: String }, // Token for resetting password
  resetPasswordExpires: { type: Date }, // Expiration time for the token
}, { timestamps: true });

module.exports = mongoose.models.User
  || mongoose.model('User', userSchema);