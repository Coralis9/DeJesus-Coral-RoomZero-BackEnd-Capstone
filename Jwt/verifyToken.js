const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.KEY_WORD); 
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Failed to authenticate token.' });
  }
}

module.exports = verifyToken;

// const jwt = require('jsonwebtoken');

// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.TheGraveyardKeepsSecretsForever);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Failed to authenticate token.' });
//   }
// }

// module.exports = verifyToken;