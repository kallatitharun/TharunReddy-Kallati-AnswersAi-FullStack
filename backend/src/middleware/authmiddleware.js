const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware function to authenticate user tokens.
 * @param {Object} req - Express request object with JWT token in headers
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void} If authentication fails, sends a response with an error; otherwise, calls the next middleware function.
 */
exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// exports.authenticate= async(req, res, next) => {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   console.log("Hello")
//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//     console.log(err)

//     if (err) return res.sendStatus(403)
//     console.log(user)
//     req.user = user

//     next()
//   })
// }
