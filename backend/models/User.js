const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'college admin'],
      required: true,
      default: 'student',
    },
    college: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
    },
    // Optional Student Info
    department: {
      type: String,
    },
    year: {
      type: Number,
    },
    // Optional Admin Info
    adminPosition: {
      type: String,
      default: "Faculty Coordinator",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);




