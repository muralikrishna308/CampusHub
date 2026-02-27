const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    role: {
        type: String,
        enum: {
          values: ["student", "admin", "super_admin"],
          message: "{VALUE} is not a valid role",
        },
        default: "student",
      },

    // college field is no longer required; students signing up via
    // Google may not have provided this information and will complete it later
    college: {
      type: String,
      trim: true,
      default: ''
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

    phone: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: '',
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    zipcode: {
      type: String,
      trim: true,
    },

    profileComplete: {
      type: Boolean,
      default: false,
    },
   
  },
  {
    timestamps: true,
  }
);

userSchema.index({ college: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
