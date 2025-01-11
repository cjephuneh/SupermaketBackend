const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['manager', 'editor', 'viewer'],
    default: 'viewer',
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: String, // Secret for 2FA (if enabled)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
