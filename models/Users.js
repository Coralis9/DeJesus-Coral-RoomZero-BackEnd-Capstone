const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please use a valid email address.',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    match: [
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/,
      'Password must contain at least one uppercase letter, one digit, and one special character.',
    ],
  },
  highscore: { type: Number, default: 0 },
  lowscore: { type: Number, default: 0 },
  victories: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  timeouts: { type: Number, default: 0 },
  fastestTime: {
    minutes: { type: Number, default: 0 },
    seconds: { type: Number, default: 0 },
  },
  collectedItems: {
    type: [String],
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  gameHistory: [
    {
      score: { type: Number, required: true },
      duration: {
        minutes: { type: Number, required: true },
        seconds: { type: Number, required: true },
      },
      completed: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
