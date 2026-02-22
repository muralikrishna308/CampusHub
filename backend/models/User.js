const mongoose = require("mongoose");

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
        values: ["student", "college_admin", "super_admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "student",
    },

    college: {
      type: String,
      required: [true, "College is required"],
      trim: true,
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
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ college: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);