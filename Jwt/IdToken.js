const jwt = require('jsonwebtoken');

const createIdToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.KEY_WORD, { expiresIn: '2h' });
};

module.exports = createIdToken;

// const jwt = require('jsonwebtoken');

// const createIdToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.KEY_WORD);
// };

// module.exports = createIdToken;