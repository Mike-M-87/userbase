const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
    validate: [validator.isMobilePhone, 'Please provide a valid phone number'],
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    required: [true, 'Please provide an email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  company: {
    type: String,
    required: [true, 'Please provide the company name'],
  },
  isAdmin: {
    type: Boolean,
    required: [true, 'Please provide the role'],
  },
  passwordChangedAt: Date,
})

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});


UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// method to generate JWT
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const UserModel = mongoose.model('UserModel', UserSchema)
module.exports = UserModel