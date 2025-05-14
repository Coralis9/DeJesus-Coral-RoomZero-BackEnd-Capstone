const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST (Create a new user)
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH (Update user details)
router.patch('/:id', async (req, res) => {
  const updates = req.body;

  // Check for empty username
  if ('username' in updates && (!updates.username || updates.username.trim() === '')) {
    return res.status(400).json({ error: 'Username cannot be empty' });
  }

  try {
    // Ensure username is unique
    if (updates.username) {
      const usernameExists = await User.findOne({ username: updates.username });
      if (usernameExists && usernameExists._id.toString() !== req.params.id) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;



