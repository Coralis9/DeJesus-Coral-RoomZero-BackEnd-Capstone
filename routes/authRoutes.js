const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const createIdToken = require('../Jwt/IdToken');
const verifyToken = require('../Jwt/verifyToken');

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must meet complexity requirements.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: 'Username or email already exists.' });

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = createIdToken(newUser._id);
    res.status(201).json({ message: 'User registered', token, username: newUser.username });
  } catch (err) {
    res.status(500).json({ message: 'Registration error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.KEY_WORD, { expiresIn: '2h' });
  res.json({ token });
});

// Update email route (protected)
router.patch('/update-email', verifyToken, async (req, res) => {
  try {
    const { newEmail } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { email: newEmail },
      { new: true }
    );

    res.json({ message: 'Email updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Email update failed' });
  }
});

module.exports = router;


