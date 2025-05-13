const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.KEY_WORD);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token, access denied.' });
    }
  } else {
    res.status(401).json({ message: 'Authorization token is missing or invalid.' });
  }
};

module.exports = protect;