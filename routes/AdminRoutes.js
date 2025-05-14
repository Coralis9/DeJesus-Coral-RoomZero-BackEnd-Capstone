const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const User = require('../models/Users');
const verifyToken = require('../Jwt/verifyToken'); 


const adminOnly = async (req, res, next) => {
  const admin = await Admin.findById(req.userId); 
  if (!admin || admin.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};


router.post('/create', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating admin', error: err.message });
  }
});


router.get('/users', verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});


router.patch('/users/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
});


router.delete('/users/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;