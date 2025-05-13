const jwt = require('jsonwebtoken');

const createIdToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.KEY_WORD);
};

module.exports = createIdToken;