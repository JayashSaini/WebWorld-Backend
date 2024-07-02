const mongoose = require('mongoose');
const {
  AvailableSocialLogins,
  AvailableUserRoles,
  UserRolesEnum,
  UserLoginType,
} = require('../constants');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: AvailableUserRoles,
    default: UserRolesEnum.USER,
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  loginType: {
    type: String,
    enum: AvailableSocialLogins,
    default: UserLoginType.EMAIL_PASSWORD,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordExpiry: {
    type: Date,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpiry: {
    type: Date,
  },
});

const User = mongoose.model('User', userSchema);
module.export = User;
