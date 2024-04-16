const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (userId, username) => {
  return jwt.sign({ userId, username }, secretKey, { expiresIn: '6h' });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
