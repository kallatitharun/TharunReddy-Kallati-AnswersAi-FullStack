const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schema for representing users.
 */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // User's username
  email: { type: String, required: true, unique: true }, // User's email address
  password: { type: String, required: true }, // User's password
  tokens: { type: Number, default: 1000 }, // Number of tokens the user has
  lastReset: { type: Date, default: Date.now },
});

/**
 * Middleware to hash the user's password before saving it to the database.
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip hashing if password is not modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Method to compare the provided password with the hashed password stored in the database.
 */
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
