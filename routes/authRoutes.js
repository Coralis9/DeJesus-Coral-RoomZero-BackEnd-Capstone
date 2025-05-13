const express = require('express');
const router = express.Router();
const User = require('../models/Users');


// Registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must contain at least one uppercase letter, one digit, one special character, and be at least 6 characters long.'
        });
    }

    try {
        
        const newUser = new User({
            username,
            password,  
        });

        
        await newUser.save();
        const token = createIdToken(newUser._id);
            res.status(201).json({
            message: 'User registered successfully!',
            token: token,
            username: newUser.username,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

module.exports = router;